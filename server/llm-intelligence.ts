/**
 * LLM-powered repository intelligence service
 * Generates purpose summaries, category suggestions, and health scores
 */

import { invokeLLM } from "./_core/llm";

interface RepositoryIntelligenceInput {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  starCount: number;
  forkCount: number;
  openIssuesCount: number;
}

interface RepositoryIntelligence {
  purpose: string;
  category: string;
  healthScore: number;
  tags: string[];
}

const CATEGORIES = [
  "quantum",
  "health",
  "AI",
  "telecom",
  "infrastructure",
  "data",
  "security",
  "web",
  "mobile",
  "other",
];

/**
 * Generate intelligence for a repository using LLM
 */
export async function generateRepositoryIntelligence(
  repo: RepositoryIntelligenceInput
): Promise<RepositoryIntelligence | null> {
  try {
    const prompt = `Analyze this GitHub repository and provide structured insights:

Repository Name: ${repo.name}
Description: ${repo.description || "No description"}
Language: ${repo.language || "Unknown"}
Stars: ${repo.starCount}
Forks: ${repo.forkCount}
Open Issues: ${repo.openIssuesCount}
URL: ${repo.url}

Please provide:
1. A brief 1-2 sentence summary of the repository's purpose
2. The most appropriate category from: ${CATEGORIES.join(", ")}
3. A health score from 0-100 based on activity level and maintenance status
4. 3-5 relevant tags

Format your response as JSON with these exact keys:
{
  "purpose": "string",
  "category": "string",
  "healthScore": number,
  "tags": ["string"]
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert software engineer analyzing GitHub repositories. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "repository_intelligence",
          strict: true,
          schema: {
            type: "object",
            properties: {
              purpose: {
                type: "string",
                description: "Brief summary of repository purpose",
              },
              category: {
                type: "string",
                enum: CATEGORIES,
                description: "Repository category",
              },
              healthScore: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                description: "Health score based on activity and maintenance",
              },
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Relevant tags for the repository",
              },
            },
            required: ["purpose", "category", "healthScore", "tags"],
            additionalProperties: false,
          },
        },
      },
    });

    const contentRaw = response.choices[0]?.message.content;
    if (!contentRaw) {
      console.error("[LLM] No content in response");
      return null;
    }

    const content = typeof contentRaw === "string" ? contentRaw : JSON.stringify(contentRaw);
    const parsed = JSON.parse(content);

    // Validate the response
    if (
      !parsed.purpose ||
      !parsed.category ||
      typeof parsed.healthScore !== "number" ||
      !Array.isArray(parsed.tags)
    ) {
      console.error("[LLM] Invalid response structure:", parsed);
      return null;
    }

    return {
      purpose: parsed.purpose,
      category: parsed.category,
      healthScore: Math.min(100, Math.max(0, parsed.healthScore)),
      tags: parsed.tags.slice(0, 5), // Limit to 5 tags
    };
  } catch (error) {
    console.error("[LLM] Failed to generate intelligence:", error);
    return null;
  }
}

/**
 * Generate intelligence for multiple repositories
 */
export async function generateBatchIntelligence(
  repos: RepositoryIntelligenceInput[]
): Promise<Map<string, RepositoryIntelligence>> {
  const results = new Map<string, RepositoryIntelligence>();

  for (const repo of repos) {
    const intelligence = await generateRepositoryIntelligence(repo);
    if (intelligence) {
      results.set(repo.name, intelligence);
    }
    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}
