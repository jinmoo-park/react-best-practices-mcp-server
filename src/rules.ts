import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface Rule {
  id: string;
  filename: string;
  title: string;
  impact: string;
  impactDescription?: string;
  tags: string[];
  category: string;
  categoryId: number;
  content: string;
  incorrect?: string;
  correct?: string;
}

export interface Section {
  id: number;
  name: string;
  prefix: string;
  impact: string;
  description: string;
}

export interface RuleIndex {
  rules: Rule[];
  sections: Section[];
  metadata: {
    version: string;
    organization: string;
    date: string;
    abstract: string;
  };
}

const CATEGORY_MAP: Record<string, { id: number; name: string; impact: string }> = {
  'async': { id: 1, name: 'Eliminating Waterfalls', impact: 'CRITICAL' },
  'bundle': { id: 2, name: 'Bundle Size Optimization', impact: 'CRITICAL' },
  'server': { id: 3, name: 'Server-Side Performance', impact: 'HIGH' },
  'client': { id: 4, name: 'Client-Side Data Fetching', impact: 'MEDIUM-HIGH' },
  'rerender': { id: 5, name: 'Re-render Optimization', impact: 'MEDIUM' },
  'rendering': { id: 6, name: 'Rendering Performance', impact: 'MEDIUM' },
  'js': { id: 7, name: 'JavaScript Performance', impact: 'LOW-MEDIUM' },
  'advanced': { id: 8, name: 'Advanced Patterns', impact: 'LOW' },
};

export class RuleLoader {
  private rulesDir: string;
  private metadataPath: string;
  private sectionsPath: string;

  constructor(baseDir: string) {
    this.rulesDir = path.join(baseDir, 'rules');
    this.metadataPath = path.join(baseDir, 'metadata.json');
    this.sectionsPath = path.join(baseDir, 'rules', '_sections.md');
  }

  private extractCategory(filename: string): string {
    const parts = filename.split('-');
    return parts[0] || 'unknown';
  }

  private extractCodeBlocks(content: string): { incorrect?: string; correct?: string } {
    const incorrectMatch = content.match(/```\w*\n([\s\S]*?)\n```/g);
    const result: { incorrect?: string; correct?: string } = {};
    
    // Find "Incorrect" section
    const incorrectSection = content.match(/\*\*Incorrect[^*]*\*\*:?([\s\S]*?)(?=\*\*Correct|$)/i);
    if (incorrectSection) {
      const codeBlock = incorrectSection[1].match(/```[\w]*\n([\s\S]*?)\n```/);
      if (codeBlock) {
        result.incorrect = codeBlock[1].trim();
      }
    }
    
    // Find "Correct" section
    const correctSection = content.match(/\*\*Correct[^*]*\*\*:?([\s\S]*?)(?=Reference|$)/i);
    if (correctSection) {
      const codeBlock = correctSection[1].match(/```[\w]*\n([\s\S]*?)\n```/);
      if (codeBlock) {
        result.correct = codeBlock[1].trim();
      }
    }
    
    return result;
  }

  async loadRules(): Promise<RuleIndex> {
    // Load metadata
    const metadataContent = await fs.readFile(this.metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    // Load all rule files
    const files = await fs.readdir(this.rulesDir);
    const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_'));

    const rules: Rule[] = [];

    for (const file of ruleFiles) {
      const filePath = path.join(this.rulesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      const categoryPrefix = this.extractCategory(file.replace('.md', ''));
      const category = CATEGORY_MAP[categoryPrefix] || {
        id: 0,
        name: 'Unknown',
        impact: 'UNKNOWN'
      };

      const codeBlocks = this.extractCodeBlocks(body);

      const rule: Rule = {
        id: file.replace('.md', ''),
        filename: file,
        title: data.title || file.replace('.md', '').replace(/-/g, ' '),
        impact: data.impact || category.impact,
        impactDescription: data.impactDescription,
        tags: (data.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        category: category.name,
        categoryId: category.id,
        content: body,
        ...codeBlocks,
      };

      rules.push(rule);
    }

    // Sort by category ID, then by title
    rules.sort((a, b) => {
      if (a.categoryId !== b.categoryId) {
        return a.categoryId - b.categoryId;
      }
      return a.title.localeCompare(b.title);
    });

    // Load sections from _sections.md if available
    const sections: Section[] = [];
    try {
      const sectionsContent = await fs.readFile(this.sectionsPath, 'utf-8');
      const sectionMatches = sectionsContent.matchAll(/## (\d+)\.\s+([^\(]+)\s+\((\w+)\)[\s\S]*?\*\*Impact:\*\*\s+(\w+)[\s\S]*?\*\*Description:\*\*\s+([^\n]+)/g);
      
      for (const match of sectionMatches) {
        const [, idStr, name, prefix, impact, description] = match;
        const categoryInfo = CATEGORY_MAP[prefix] || {
          id: parseInt(idStr, 10),
          name: name.trim(),
          impact: impact.trim(),
        };
        sections.push({
          id: categoryInfo.id,
          name: categoryInfo.name,
          prefix,
          impact: categoryInfo.impact,
          description: description.trim(),
        });
      }
    } catch (error) {
      // Fallback to category map if sections file not found
      sections.push(...Object.entries(CATEGORY_MAP)
        .map(([prefix, info]) => ({
          id: info.id,
          name: info.name,
          prefix,
          impact: info.impact,
          description: '',
        }))
        .sort((a, b) => a.id - b.id));
    }

    return {
      rules,
      sections,
      metadata,
    };
  }

  searchRules(query: string, ruleIndex: RuleIndex): Rule[] {
    const lowerQuery = query.toLowerCase();
    return ruleIndex.rules.filter(rule => {
      return (
        rule.title.toLowerCase().includes(lowerQuery) ||
        rule.content.toLowerCase().includes(lowerQuery) ||
        rule.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        rule.category.toLowerCase().includes(lowerQuery)
      );
    });
  }

  filterRules(
    ruleIndex: RuleIndex,
    options?: {
      category?: string;
      impact?: string;
      tags?: string[];
    }
  ): Rule[] {
    let filtered = ruleIndex.rules;

    if (options?.category) {
      const categoryLower = options.category.toLowerCase();
      filtered = filtered.filter(rule => {
        const ruleCategoryLower = rule.category.toLowerCase();
        const rulePrefix = this.extractCategory(rule.id);
        return ruleCategoryLower === categoryLower || rulePrefix === categoryLower;
      });
    }

    if (options?.impact) {
      filtered = filtered.filter(rule => 
        rule.impact.toUpperCase() === options.impact!.toUpperCase()
      );
    }

    if (options?.tags && options.tags.length > 0) {
      filtered = filtered.filter(rule =>
        options.tags!.some(tag => rule.tags.includes(tag))
      );
    }

    return filtered;
  }
}
