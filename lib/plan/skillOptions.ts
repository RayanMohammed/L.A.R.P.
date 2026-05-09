import {
  CAREER_FIELDS,
  DEFAULT_FIELD_ID,
  type FieldId,
  type FieldSkillGroup,
} from "./fields";

/**
 * Curated skill / experience tags shown in step 2 of the intake.
 * Designed for first-year reality: lots of "I took an intro class" and
 * "I led one event" — no FAANG bullets. The "Honest answers" group is
 * intentional — first quarter is allowed to be empty.
 */
export type SkillGroup = {
  label: string;
  options: string[];
};

const SHARED_SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Transferable signals",
    options: [
      "had a paid job (any kind)",
      "customer service experience",
      "volunteered consistently for a cause",
      "competitive sport / performing arts at a serious level",
      "founded something",
    ],
  },
  {
    label: "If you're not sure, it's okay to click one of these options.",
    options: [
      "nothing yet — first quarter",
      "I'm not sure what counts",
    ],
  },
];

export function getSkillGroupsForField(
  fieldId: FieldId | null | undefined,
): SkillGroup[] {
  const field =
    CAREER_FIELDS.find((candidate) => candidate.id === fieldId) ??
    CAREER_FIELDS.find((candidate) => candidate.id === DEFAULT_FIELD_ID);

  return [...toSkillGroups(field?.skillGroups ?? []), ...SHARED_SKILL_GROUPS];
}

function toSkillGroups(groups: FieldSkillGroup[]): SkillGroup[] {
  return groups.map((group) => ({
    label: group.label,
    options: group.options,
  }));
}
