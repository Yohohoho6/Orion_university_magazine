import { Card, CardBody, Checkbox } from "@heroui/react";
import { useAcademicYears } from "../hooks/useAcademicYears";

const baseTerms = [
  "The submitted work is your original creation and does not violate any copyright.",
  "You grant the university permission to publish your work in the annual magazine.",
  "The university may edit your submission for clarity, grammar, and formatting.",
  "Your submission may be reviewed and commented on by your Faculty Marketing Coordinator.",
  "Selected contributions will be included in the final magazine publication.",
  "You retain copyright of your work but grant non-exclusive publication rights.",
];

export function TermsAndConditions({ isAgreed, onAgreeChange }) {
  const { data: yearsRes } = useAcademicYears();

  const academicYears = yearsRes?.data ?? [];
  const targetYear = academicYears.find((year) => year.is_active);
  const finalClosureDate = targetYear?.final_closure_date ?? "TBD";

  const terms = [
    ...baseTerms.slice(0, 4),
    `You can edit your submission until the final closure date (${finalClosureDate}).`,
    ...baseTerms.slice(4),
  ];

  return (
    <Card
      shadow="none"
      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      radius="lg"
    >
      <CardBody className="p-4 sm:p-6">
        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Terms and Conditions
        </h2>

        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 sm:p-5">
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 leading-relaxed">
            By submitting content to the University Magazine, you agree to the
            following terms:
          </p>
          <ol className="flex flex-col gap-2 sm:gap-2.5">
            {terms.map((term, index) => (
              <li
                key={index}
                className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed"
              >
                {index + 1}. {term}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 sm:mt-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4">
          <Checkbox
            isSelected={isAgreed}
            onValueChange={onAgreeChange}
            color="primary"
            size="md"
            classNames={{
              base: "items-start max-w-full",
              label: "text-xs sm:text-sm text-gray-900 dark:text-gray-100 leading-relaxed",
            }}
          >
            I have read and agree to the Terms and Conditions. I confirm that
            this work is my original creation and I grant permission for its
            publication in the university magazine.
          </Checkbox>
        </div>
      </CardBody>
    </Card>
  );
}