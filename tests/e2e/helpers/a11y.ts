import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

type AxeBuilderOptions = Omit<
  NonNullable<ConstructorParameters<typeof AxeBuilder>[0]>,
  "page"
>;

type A11yCheckOptions = AxeBuilderOptions & {
  include?: string[];
  exclude?: string[];
};

export async function expectNoAxeViolations(
  page: Page,
  options?: A11yCheckOptions,
) {
  const { include = [], exclude = [], ...builderOptions } = options ?? {};
  let builder = new AxeBuilder({ page, ...builderOptions });

  for (const selector of include) {
    builder = builder.include(selector);
  }

  for (const selector of exclude) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();
  expect(results.violations).toEqual([]);
}
