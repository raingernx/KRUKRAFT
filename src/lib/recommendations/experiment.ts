/**
 * Recommendation A/B experiment: Phase 1 (category-trending) vs Phase 2
 * (behavior-based scoring).
 *
 * Assignment is deterministic per userId via a djb2-style hash so the same
 * user always lands in the same arm across requests and across page loads.
 * Guest users are never assigned — they always see the generic global feed.
 */

export const RECOMMENDATION_EXPERIMENT_ID = "rec_phase2_v1";

export type RecommendationVariant = "phase1" | "phase2";

/**
 * djb2-style 32-bit unsigned hash — fast, no dependencies, uniform enough
 * for a 50/50 split across cuid/uuid userId values.
 */
function hashUserId(userId: string): number {
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) + hash) ^ userId.charCodeAt(i);
    hash = hash >>> 0; // keep as 32-bit unsigned integer
  }
  return hash;
}

/**
 * Returns "phase1" or "phase2" for an authenticated user.
 * The assignment is stable: calling this twice with the same userId always
 * returns the same value, so the user never switches arms mid-session.
 */
export function assignRecommendationVariant(userId: string): RecommendationVariant {
  return hashUserId(userId) % 2 === 0 ? "phase1" : "phase2";
}
