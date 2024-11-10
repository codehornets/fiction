# Brand Style Guide
*System guidance: Use this guide to validate content and assist content creation. Each field serves as context for AI assistance and human review.*

## Core Brand Strategy

### Brand Archetype
- Primary Archetype:
 * Input: [Select one: Sage, Hero, Creator, Explorer, Rebel, Magician, Regular Guy/Gal, Lover, Caregiver, Jester, Ruler, Innocent]
 * System guidance: Use archetype to inform tone and narrative style
- Key Characteristics:
 * Input: [3-5 descriptive traits that define your archetype]
 * Format: Comma-separated list
 * Example: "Wise, analytical, objective, truth-seeking"
- Communication Style:
 * Input: [How should this archetype shape content creation?]
 * Format: Brief paragraph
 * Example: "Focus on presenting well-researched information, using data to support claims, maintaining objectivity"

### Mission & Value Proposition
- Purpose Statement:
 * Input: [What is your core purpose?]
 * Length: 1-2 sentences
 * Example: "To empower small businesses through accessible technology solutions"
- Value Proposition:
 * Input: [Your unique offering and its value]
 * Format: Problem → Solution → Benefit
 * Example: "While enterprise software is complex and expensive, we provide simplified tools at SMB-friendly prices"
- Target Audiences:
 * Primary: [Specific description of main audience]
 * Secondary: [Additional audiences]
 * Format: Demographics + Psychographics + Needs
- Audience Pain Points:
 * Input: [List key challenges for each audience]
 * Format: Problem: Impact: Desired Outcome
 * Example: "Limited budget: Can't afford enterprise solutions: Needs affordable alternatives"

### Brand Values & Personality
- Core Values:
 * Input: [List 3-5 core values]
 * Format: Value: Definition: Application
 * Example: "Innovation: Pushing boundaries in technology: Reflected in cutting-edge features"
- Decision Guidelines:
 * Input: [How values guide content decisions]
 * Format: If/Then statements
 * Example: "If content doesn't demonstrate innovation, revise to highlight new approaches"
- Brand Personality:
 * Input: [Key personality traits]
 * Format: Trait: Expression
 * Example: "Innovative: Uses forward-thinking language and examples"

### Voice & Communication
- Tone Range:
 * Format: Slider scale 1-5
 * Formal ←→ Casual
 * Professional ←→ Friendly
 * Technical ←→ Simple
 * Reserved ←→ Enthusiastic
- Writing Approach:
 * Sentence Length: [Short/Medium/Long]
 * Paragraph Style: [Concise/Detailed]
 * Technical Level: [Basic/Intermediate/Advanced]
- Language Guidelines:
 * Preferred Terms: [List approved terminology]
 * Restricted Terms: [List terms to avoid]
 * Format: CSV list with alternatives

## Content Architecture

### Content Pillars
- Primary Themes:
 * Structure: {
     name: string,
     description: string,
     approach: string,
     subtopics: string[],
     audienceAlignment: string[],
     examples: string[]
   }
 * Required fields: name, description, approach
 * Example: {
     name: "Technology Innovation",
     description: "Latest developments in tech",
     approach: "Focus on practical applications",
     subtopics: ["AI", "Cloud", "Mobile"],
     audienceAlignment: ["Tech Leaders", "Developers"],
     examples: ["AI Implementation Guide", "Cloud Migration Case Study"]
   }

### Audience Content Matrix
- Structure: {
   audienceSegment: string,
   painPoints: string[],
   contentThemes: string[],
   preferredFormats: string[],
   engagementTriggers: string[],
   successMetrics: string[]
 }
- Example: {
   audienceSegment: "Small Business Owners",
   painPoints: ["Limited time", "Budget constraints"],
   contentThemes: ["Efficiency", "Cost-saving"],
   preferredFormats: ["Quick guides", "Video tutorials"],
   engagementTriggers: ["ROI stats", "Time-saving tips"],
   successMetrics: ["Implementation rate", "Time saved"]
 }
