import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe.configure({ mode: 'parallel' });

test.describe('Home to COVID Vax by Age', () => {

    test('Home to Tracker', async ({ page }) => {

        // Landing Page Loads
        await page.goto('/', { waitUntil: "commit" });
        await expect(page.locator('#main')).toContainText('Advancing Health Justice');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .exclude('iframe') // YouTube embed is not fully accessible
            .analyze();
        expect(accessibilityScanResults.violations).toEqual([]);

        // Clicking large CTA button takes us to the tracker
        const exploreButton = page.locator('#landingPageCTA')
        exploreButton.click();
        await expect(page).toHaveURL(/.*exploredata/);

    })

    test('Tracker Default to Covid Vax', async ({ page }) => {

        // Load Tracker Default helper view
        await page.goto(`/exploredata`, { waitUntil: "commit" });

        // stop the pulsing button so we can target it
        await page.emulateMedia({ reducedMotion: "reduce" });

        // choose VAXX from the no topic screen
        const madLibTopic = page.locator('button:visible:has-text("select a topic")')
        madLibTopic.click();
        const covidVaxOption = page.locator('span:has-text("COVID-19 Vaccinations")')
        covidVaxOption.click();
        await expect(page).toHaveURL(/.*mls=1.covid_vaccinations-3.00/);

        // back button works properly for madlib condition changes
        await page.goBack()
        await expect(page).not.toHaveURL(/.*mls=1.covid_vaccinations-3.00/);

        const accessibilityScanResults = await new AxeBuilder({ page })
            .exclude('iframe') // YouTube embed is not fully accessible
            .analyze();
        expect(accessibilityScanResults.violations).toEqual([]);

    })

    test('Covid Vax Toggle Age', async ({ page }) => {

        // Starting with COVID VAX
        await page.goto(`/exploredata?mls=1.covid_vaccinations-3.00`, { waitUntil: "commit" });

        // Changing demographic dropdown setting to AGE should change URL
        await page.getByRole('combobox', { name: 'Demographic Race/ethnicity' }).click();
        await page.getByRole('option', { name: 'Age' }).click();
        await expect(page).toHaveURL(/.*demo=age/);

        // back button works properly for demographic toggle changes
        await page.goBack()
        await expect(page).not.toHaveURL(/.*demo=age/);

    });


});