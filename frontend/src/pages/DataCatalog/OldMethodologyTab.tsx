import {
  CONTACT_TAB_LINK,
  DATA_CATALOG_PAGE_LINK,
} from '../../utils/internalRoutes'
import { Helmet } from 'react-helmet-async'
import { LinkWithStickyParams } from '../../utils/urlutils'
import { METRIC_CONFIG } from '../../data/config/MetricConfig'
import { Card } from '@mui/material'
import { urlMap } from '../../utils/externalUrls'
import DefinitionsList from '../../reports/ui/DefinitionsList'

import { Link } from 'react-router-dom'
import {
  MissingCAWPData,
  MissingCovidData,
  MissingCovidVaccinationData,
  MissingHIVData,
  MissingPrepData,
  MissingAHRData,
  MissingPhrmaData,
} from '../Methodology/methodologyContent/missingDataBlurbs'
import { SHOW_PHRMA_MENTAL_HEALTH } from '../../data/providers/PhrmaProvider'
import { HashLink } from 'react-router-hash-link'
import { selectFAQs } from '../WhatIsHealthEquity/FaqData'
import { CITATION_APA } from '../../cards/ui/SourcesHelpers'
import HetHorizontalRuleHeading from '../../styles/HetComponents/HetHorizontalRuleHeader'

export default function OldMethodologyTab() {
  return (
    <>
      <Helmet>
        <title>Methodology - Health Equity Tracker</title>
      </Helmet>
      <h2 className='sr-only'>Methodology</h2>
      <div className='m-auto max-w-md px-5 py-12'>
        <article className='pb-6'>
          <h2
            id='main'
            className='text-left font-serif text-smallestHeader font-light text-altBlack'
          >
            Recommended citation (APA) for the Health Equity Tracker:
          </h2>

          <div className='p-2 font-sansText text-text shadow-raised-tighter'>
            <p className='m-4 pl-12 pr-4 first-of-type:-indent-8'>
              {CITATION_APA}
            </p>
          </div>
        </article>
        <article className='pb-6'>
          <h2 className='text-left font-serif text-smallestHeader font-light text-altBlack'>
            {selectFAQs[4].questionText}
          </h2>
          <div className='text-left font-sansText text-text'>
            {<>{selectFAQs[4].answer}</>}
          </div>
        </article>

        <article className='pb-6 text-left font-sansText text-text'>
          <h2 className='text-left font-serif text-smallestHeader font-light text-altBlack'>
            What are the limitations of the tracker, and why were these health
            equity topics chosen?
          </h2>
          <section>
            <HetHorizontalRuleHeading id='covid' headingText='COVID-19' />
            <ul>
              <li>
                National statistics are aggregations of state-wide data. If
                state data is not available, these aggregations may be
                incomplete and potentially skewed.
              </li>

              <li>
                To protect the privacy of affected individuals, COVID-19 data
                may be hidden in counties with low numbers of COVID-19 cases,
                hospitalizations and deaths.
              </li>

              <li>
                The underlying data is reported by the CDC at the case-level, so
                we cannot determine whether a state/county lacking cases for a
                particular demographic group truly has zero cases for that group
                or whether that that locale fails to report demographics
                correctly.
              </li>
            </ul>

            <h4>COVID-19 time-series data</h4>
            <ul>
              <li>
                The CDC Restricted dataset includes a field called{' '}
                <b>cdc_case_earliest_dt</b>, which represents the earliest of
                either the date of first symptoms onset, a positive COVID test,
                or the date the case was first reported to the CDC. We use the
                month and year of this field to categorize the month and year
                that each COVID case, death, and hospitalization occurred. It is
                important to note here, that, for deaths and hospitalizations,
                we plot the month the case was first reported, and not when the
                death or hospitalization itself occurred.
              </li>
              <li>
                We chose to use this field because it is filled out for the vast
                majority of cases, and because it provides the best estimate we
                can get on when the COVID case in question occurred.
              </li>
              <li>
                We only count confirmed deaths and hospitalizations in the{' '}
                <b>per100k</b> and <b>inequitable distribution</b> metrics, so
                when we show “zero” deaths or hospitalizations for a demographic
                group in any month, it is possible that there are unconfirmed
                deaths or hospitalizations for that group in that month, but
                they have not been reported to the CDC.
              </li>
              <li>
                If a geographic jurisdiction reports zero cases, deaths, or
                hospitalizations for a demographic for the entire pandemic, we
                leave that demographic off of our charts all together, as we
                assume they are not collecting data on that population.
              </li>
              <li>
                Each chart represents the “incidence rate” – the amount of new
                cases that were reported in each month.
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingCovidData />
            </Card>
          </section>

          <section>
            <HetHorizontalRuleHeading
              id='covid_vaccinations'
              headingText='COVID-19 vaccinations'
            />

            <p>
              Because there is currently no national vaccine demographic
              dataset, we combine the best datasets we could find for each
              geographic level.
            </p>
            <ul>
              <li>
                For the national level numbers, we use the{' '}
                <a href={urlMap.cdcVaxTrends}>
                  CDC vaccine demographic dataset,
                </a>{' '}
                which provides data on the race/ethnicity, sex, and age range of
                vaccine recipients, as well whether they have taken one or two
                shots.{' '}
              </li>

              <li>
                For the state level we use{' '}
                <a href={urlMap.kffCovid}>
                  the Kaiser Family Foundation COVID-19 Indicators dataset,
                </a>{' '}
                which is a hand-curated dataset based on analysis from state
                health department websites. It is the only state level
                demographic vaccine dataset that publishes this data in a usable
                format. The dataset only provides data on the race and ethnicity
                of vaccine recipients, and for the majority of states counts
                individuals who have received at least one shot as vaccinated.
                It does not include any data for US territories.{' '}
              </li>
              <li>
                For the county level, we could not identify a dataset that
                provides vaccine demographics, so to show some context we use
                the{' '}
                <a href={urlMap.cdcVaxCounty}>
                  COVID-19 Vaccinations in the United States, County dataset
                </a>{' '}
                which provides the total number of vaccinations per county.
              </li>
            </ul>
            <h4> Vaccination population sources </h4>
            <ul>
              <li>
                For the national numbers we use the population numbers provided
                by the CDC, we chose to do this because they include population
                estimates from <b>Palau</b>, <b>Micronesia</b>, and the{' '}
                <b>U.S. Marshall Islands,</b> which are difficult to find
                estimations for. Furthermore the CDC has estimations for age
                ranges that the ACS numbers do not readily provide, as they use
                a per year population estimate from the ACS that we do not use
                anywhere else and have not added to our system.
              </li>
              <li>
                For the state level, to calculate the total number of
                vaccinations we use the ACS 2019 estimates of each state’s
                population. The population counts for each demographic group at
                the state level are provided by the Kaiser Family Foundation,
                who researched exactly what the definition of each demographic
                group in every state is. They provide population estimates for{' '}
                <b>Asian</b>, <b>Black</b>, <b>White</b>, and <b>Hispanic</b>,
                so we fill in the ACS 2019 estimation for{' '}
                <b>American Indian and Alaska Native</b>, and{' '}
                <b>Native Hawaiian and Pacific Islander</b>. These alternate
                population comparisons metrics shown with a different color on
                the disparities bar chart. We are unable to show a population
                comparison metric for “Unrepresented Race” because we are unsure
                of the definition in each state.
              </li>
              <li>
                For the county level we use the ACS 2019 population estimations.
              </li>
            </ul>
            <h4>Vaccination data limitations</h4>
            <ul>
              <li>
                <b>New Hampshire</b> lifted its national COVID-19 emergency
                response declaration in May 2021, which allows vaccine
                recipients to opt out of having their COVID-19 vaccinations
                included in the state’s IIS. As such, data submitted by New
                Hampshire since May 2021 may not be representative of all
                COVID-19 vaccinations occurring in the state.
              </li>
              <li>
                Some states report race and ethnicity separately, in which case
                they report unknown percentages separately. In this case, we
                show the higher of the two metrics on the national map of
                unknown cases, and display both numbers on the state page.
              </li>
              <li>
                The Kaiser Family Foundation only collects population data for{' '}
                <b>Asian</b>, <b>Black</b>, <b>White</b>, and <b>Hispanic</b>{' '}
                demographics, limiting their per 100k metrics and what
                demographic breakdowns we are able to show at the state level.
              </li>
              <li>
                As there is no standardized definition for “vaccinated”, we
                display vaccination data as “at least one dose” which is used by
                most states. However, some states including <b>Arkansas</b>,{' '}
                <b>Illinois</b>, <b>Maine</b>, <b>New Jersey</b>, and{' '}
                <b>Tennessee</b> report “Total vaccine doses administered”, in
                which case those numbers are reported.
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingCovidVaccinationData />
            </Card>
          </section>

          <section>
            <span id='asthma'></span>
            <span id='avoided_care'></span>
            <span id='cardiovascular_diseases'></span>
            <span id='chronic_kidney_disease'></span>
            <span id='copd'></span>
            <span id='depression'></span>
            <span id='diabetes'></span>
            <span id='excessive_drinking'></span>
            <span id='frequent_mental_distress'></span>
            <span id='preventable_hospitalizations'></span>
            <span id='substance'></span>
            <span id='suicide'></span>
            <span id='voter_participation'></span>

            <HetHorizontalRuleHeading headingText='America’s Health Rankings' />

            <p>
              Multiple chronic disease, behavioral health, and social
              determinants of health in the tracker are sourced from{' '}
              <a href={urlMap.amr}>America’s Health Rankings (AHR)</a>, who in
              turn source the majority of their data from the{' '}
              <a href={urlMap.cdcBrfss}>
                Behavioral Risk Factor Surveillance System (BRFSS)
              </a>
              , a survey run by the CDC, along with supplemental data from{' '}
              <a href={urlMap.cdcWonder}>CDC WONDER</a> and the{' '}
              <a href={urlMap.censusVoting}>US Census</a>.
            </p>
            <ul>
              <li>
                Because BRFSS is a survey, there are not always enough
                respondents to provide a statistically meaningful estimate of
                disease prevalence, especially for smaller and typically
                marginalized racial groups. Please see the{' '}
                <a href={urlMap.amrMethodology}>methodology page</a> of
                America’s Health Rankings for details on data suppression.
              </li>
              <li>
                BRFSS data broken down by race and ethnicity is not available at
                the county level, so the tracker does not display these
                conditions at the county level either.
              </li>
              <li>
                All metrics sourced from America’s Health Rankings are
                calculated based on the rates provided from their downloadable
                data files:
                <ul>
                  <li>
                    For most conditions, AHR provides these rates as a
                    percentage, though in some cases they use cases per 100,000.
                    If we present the condition using the same units, we simply
                    pass the data along directly. If we need to convert a rate
                    they present as a <b>percent</b> into a <b>per 100k</b>, we
                    multiply their percent amount by 1,000 to obtain the new per
                    100k rate.
                    <code>5% (of 100) === 5,000 per 100,000</code>.
                  </li>
                  <li>
                    For COPD, diabetes, frequent mental distress, depression,
                    excessive drinking, asthma, avoided care, and suicide, we
                    source the <b>percent share</b> metrics directly from AHR.
                  </li>
                </ul>
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingAHRData />
            </Card>
          </section>

          <section>
            <HetHorizontalRuleHeading
              id='women_in_gov'
              headingText='Women in legislative office'
            />

            <aside
              aria-label='Equity implications of women in legislative office'
              className='bg-standardInfo px-8 py-4 shadow-raised-tighter'
            >
              <a href={urlMap.doi1}>A link has been established</a> between
              having women in government and improvements in population health.{' '}
              <a href={urlMap.doi2}>Women in legislative office</a> have been
              shown to <a href={urlMap.doi3}>advocate for policies</a> that
              pertain to some of the crucial social and political determinants
              of health that impact the overall health of our nation such as
              education, poverty, social welfare, reproductive and maternal
              health, children, and family life. These policies in turn play a
              significant role in the advancement of health equity for all.
            </aside>

            <p>
              By leveraging data from the{' '}
              <a href={urlMap.cawp}>
                Center for American Women in Politics (CAWP)
              </a>{' '}
              we are able to present two primary metrics on these reports:
            </p>
            <ul>
              <li>
                The intersectional representation (e.g.{' '}
                <i>
                  “What percent of all Georgia state legislators are black
                  women?”
                </i>
                ).{' '}
              </li>
              <li>
                The race/ethnicity distribution amongst women legislators (e.g.{' '}
                <i>
                  “What percent of the women in the Georgia State Legislature
                  are black?“
                </i>
                ){' '}
              </li>
            </ul>

            <p>
              These metrics are calculated for two distinct data types:{' '}
              <b>Women in State Legislature</b> and{' '}
              <b>Women in U.S. Congress</b>, and both of these data types are
              available at the state, territory, and national levels. Our
              percentage calculations at the national level specifically include
              legislators from the U.S. territories, which can result in
              slightly different results than those presented on the CAWP
              website. All gender and race/ethnicity categorizations are
              self-reported, and a legislator may be represented in multiple
              race groupings if that is how they identify.
            </p>

            <p>
              We are also able to track these rates over time as outlined below.
              A member is counted towards the numerator any year in which they
              served even a single day, and similarly counted towards the
              denominator for U.S. Congress total counts. This results in the
              "bumpiness" observed as the proportions change incrementally with
              more persons serving per year than there are available seats. For
              state legislators, the denominators total counts simply represent
              the number of seats available, and do not fluctuate with election
              turnover. While we can track U.S. Congress back to just before the
              first woman was elected to the U.S. Congress in 1917, we can only
              track representation in state legislators back to 1983, as that is
              the furthest back that our data sources reliably provide the
              denominator used of total state legislators count, per year, per
              state.
            </p>
            <ul>
              <li>
                Historical, intersectional representation (e.g.{' '}
                <i>
                  “In each year since 1915, what percent of all U.S. Congress
                  members identified as black women?”
                </i>
                ). We obtain the historical counts of U.S. Congress members, by
                year and by state/territory, from the open-source{' '}
                <a href={urlMap.unitedStatesIo}>@unitedstates project</a>.
              </li>
              <li>
                Historical relative inequity (e.g.{' '}
                <i>
                  “In each year since 2019, what percent over- or
                  under-represented were black women when compared to their
                  share of represention amongst all women Congress members?”
                </i>
                ) Note: we currently track this measure back only to 2019, as we
                are utilizing the 2019 ACS 5-year estimates for the population
                comparison metric.{' '}
              </li>
            </ul>

            <p>
              Unfortunately CAWP and the U.S. Census use some different
              race/ethnicity groupings, making direct comparisons and
              calculations difficult or impossible in some cases. For specific
              methodology on the race groups collected by CAWP, please{' '}
              <a href={urlMap.cawp}>visit their database directly</a> . We have
              made several adjustments to our methods to incorporate these
              non-standard race groupings when possible:
            </p>

            <ul>
              <li>
                Women who identify as multiple specific races are listed
                multiple times in each corresponding race visualization.
                Therefore, these race/ethnicity groupings are non-exclusive, and
                cannot be summed. Additionally, a small number of women identify
                as the specific race label <b>Multiracial Alone</b>, without
                specifying the multiple races with which they identify. Both of
                these multiple-race groups are combined into our{' '}
                <b>Women of two or more races</b> group.
              </li>
              <li>
                The composite race group{' '}
                <b>American Indian, Alaska Native, Asian & Pacific Islander</b>{' '}
                is our best attempt to visualize the impact to these
                under-represented groups; to accurately compare against
                available population data from the U.S. Census we must further
                combine these distinct racial identities.
              </li>
              <li>
                There is currently no population data collected by the U.S.
                Census for <b>Middle Eastern & North African</b>, although this
                data equity issue has seen{' '}
                <a href={urlMap.senateMENA} rel='noreferrer' target='_blank'>
                  some progress
                </a>{' '}
                in recent decades. Currently, <b>MENA</b> individuals are
                counted by the ACS as <b>White</b>.
              </li>
            </ul>
            <Card className='bg-standardWarning px-8 py-4'>
              <MissingCAWPData />
            </Card>
          </section>

          <section>
            <HetHorizontalRuleHeading id='hiv' headingText='HIV' />

            <p id='hiv_black_women'>
              The CDC collects and studies information on the number of people
              diagnosed with HIV in the United States. This information is
              gathered from state and local HIV surveillance programs and is
              used to better understand the impact of HIV across the country. To
              protect people’s privacy, the CDC and these programs have agreed
              to limit the amount of data released at the state and county
              levels. It takes 12 months for the data to become official, so the
              numbers reported before this time are not final and should be
              interpreted with caution. Additionally, some of the data is
              adjusted to account for missing information on how people became
              infected with HIV. This means that the data may change as more
              information becomes available.
            </p>
            <p>
              The COVID-19 pandemic significantly disrupted data for the year
              2020. This impact could lead to distortions in the reported
              numbers. Please exercise caution when analyzing this year's data.
            </p>
            <p>
              Data for the years 2022 and 2023 are preliminary. For this reason,
              we have chosen 2021 as our source year when presenting single-year
              figures.
            </p>

            <p>
              <b>HIV Deaths, Diagnosis, & Prevalence</b>
            </p>
            <p>
              Death data include deaths of persons aged 13 years and older with
              diagnosed HIV infection or AIDS classification, regardless of the
              cause of death. Death data are based on a 12-month reporting delay
              to allow data to be reported to CDC. For death data, age is based
              on the person’s age at the time of death.
            </p>
            <p>
              HIV diagnoses refer to the number of HIV infections confirmed by
              laboratory or clinical evidence during a specific calendar year.
              Diagnoses of HIV infection are counted for individuals who are 13
              years of age or older and have received a confirmed diagnosis of
              HIV during the specified year. For incidence estimates, age is
              based on the person’s age at infection.
            </p>
            <p>
              HIV prevalence refers to the estimated number of individuals aged
              13 and older living with HIV at the end of the specified year,
              regardless of when they were infected or whether they received a
              diagnosis.This measure estimates the burden of HIV in a
              population.
            </p>
            <ul>
              <li>
                All metrics sourced from the CDC for HIV deaths and diagnoses
                are calculated directly from the raw count of those cases. In
                contrast, HIV prevalence is determined by estimating the total
                number of individuals who have ever been infected with HIV
                (diagnosed and undiagnosed cases) and then adjusting for the
                reported total number of people diagnosed with HIV and
                subsequently died provided by the CDC’s Atlas database.
                <ul>
                  <li>
                    <b>Percent share</b>: To calculate the percent share of
                    HIVdeaths, diagnoses, or prevalence, we divide the number of
                    HIV deaths, diagnoses, or prevalence in a specific
                    demographic group by the total number of HIV deaths,
                    diagnoses, or prevalence and multiply the result by 100.
                  </li>
                  <li>
                    <b>Population percent</b>: The population data is obtained
                    directly from the CDC. To calculate the population percent
                    share, we divide the number of individuals in a specific
                    population by the total number of individuals in the larger
                    population and multiply the result by 100.
                  </li>
                  <li>
                    <b>Rate Per 100k</b>: The rate per 100k for HIV deaths,
                    diagnoses, and prevalence is obtained directly from the CDC.
                    Calculating the rate per 100k of HIV deaths, diagnoses, or
                    prevalence involves dividing the number of deaths,
                    diagnoses, or prevalence within a specific population by the
                    total population of that group, multiplying the result by
                    100,000, and then expressing it as a rate per 100,000
                    people.
                  </li>
                </ul>
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingHIVData />
            </Card>

            <p id='hiv_prep'>
              <b>PrEP Coverage</b>
            </p>
            <p>
              PrEP coverage, reported as a percentage, is defined as the number
              of persons aged 16 years and older classified as having been
              prescribed PrEP during the specified year divided by the estimated
              annual number of persons aged 16 years and older with indications
              for PrEP during the specified year.
            </p>
            <p>
              The percentage of PrEP coverage is an important measure for
              evaluating the success of PrEP implementation and uptake efforts,
              as well as for identifying disparities in PrEP access and use
              among different demographic groups or geographic regions. It can
              also be used to monitor changes in PrEP coverage over time and to
              inform targeted interventions to increase PrEP uptake and reduce
              HIV incidence among high-risk populations. Using PrEP coverage as
              a percentage helps to convey the actual proportion of individuals
              who are covered by PrEP relative to the total population of
              interest. Creating a clear picture of the proportion of
              individuals who are eligible for PrEP and have access to it.
            </p>
            <p>
              PrEP coverage is often considered a necessary precursor to PrEP
              usage. Without adequate PrEP coverage, individuals who are at high
              risk for HIV may not have access to PrEP or may not be aware of
              its availability. As a result, PrEP usage may be lower in
              populations with low PrEP coverage.
            </p>
            <ul>
              <li>
                All metrics sourced from the CDC are calculated based on the
                number of PrEP prescriptions provided by the CDC’s Atlas
                database.
                <ul>
                  <li>
                    <b>Percent share</b>: Calculating the percent share of PrEP
                    prescriptions involves dividing the number of PrEP
                    prescriptions filled by a specific population or demographic
                    group by the total number of PrEP prescriptions filled and
                    multiplying the result by 100.
                  </li>
                  <li>
                    <b>PrEP-eligible population percent</b>: Calculating the
                    percent share of the PrEP-eligible population involves
                    dividing the number of individuals within a specific
                    population or demographic group eligible for PrEP by the
                    total number of individuals eligible for PrEP and
                    multiplying the result by 100.
                  </li>
                  <li>
                    <b>PrEP coverage</b>: This percentage is obtained directly
                    from the CDC. It involves dividing the number of individuals
                    within a specific population or demographic group using PrEP
                    at a given time by the total number of individuals in the
                    same population or demographic group eligible for PrEP based
                    on their HIV risk and multiplying the result by 100.
                  </li>
                  <li>
                    <b>Relative Inequity</b>: Calculating the percentage of
                    relative inequity involves subtracting the proportion of all
                    PrEP prescriptions filled by a specific population or group
                    from the proportion of a specific population or group in the
                    PrEP-eligible population. The value is divided by the
                    proportion of a specific population or group in the
                    PrEP-eligible population multiplied by 100 to express it as
                    a percentage.
                  </li>
                </ul>
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingPrepData />
            </Card>

            <p id='hiv_care'>
              <b>Linkage to Care</b>
            </p>
            <p>
              Linkage to HIV care, reported as a percentage, refers to the
              number of persons aged 13 years and older newly diagnosed with
              HIV, having at least one CD4 or viral load test performed within
              one month of diagnosis during the specified year and divided by
              the number of persons aged 13 years and older newly diagnosed with
              HIV during the specified year.
            </p>
            <p>
              Linkage to HIV care is a critical step in the HIV care continuum
              and can improve health outcomes for individuals with HIV. When a
              person living with HIV is linked to care soon after their
              diagnosis, they can receive the medical treatment and support they
              need to manage their HIV, reduce the amount of virus in their
              body, improve their health, and lower the risk of transmitting HIV
              to others. Delayed linkage to care can result in poorer health
              outcomes for individuals living with HIV and can increase the risk
              of transmitting HIV to others.
            </p>

            <ul>
              <li>
                All metrics sourced from the CDC are calculated based on the
                number of cases of HIV diagnosis where individuals have received
                at least 1 CD4 or viral load test performed less than one month
                after diagnosis.
                <ul>
                  <li>
                    <b>Percent share</b>: Calculating the percent share of
                    individuals who received testing or treatment within a month
                    involves dividing the number of people with access to HIV
                    care by a specific population or demographic group by the
                    total number of people with access to HIV care and
                    multiplying the result by 100.
                  </li>
                  <li>
                    <b>Diagnosed population percent</b>: Calculating the percent
                    share of the population involves dividing the number of
                    individuals within a specific population or demographic
                    group with HIV diagnoses by the total number of individuals
                    with HIV diagnoses and multiplying the result by 100.
                  </li>
                  <li>
                    <b>Linkage to Care</b>: This percentage is obtained directly
                    from the CDC. It involves dividing the number of individuals
                    within a specific population or demographic group with
                    access to care at a given time by the total number of
                    individuals living with HIV in the same population or
                    demographic group and multiplying the result by 100.
                  </li>
                  <li>
                    <b>Relative Inequity</b>: Calculating the percentage of
                    relative inequity involves subtracting the proportion of all
                    individuals with access to care by a specific population or
                    group from the proportion of a specific population or group
                    in the diagnosed population. The value is divided by the
                    proportion of a specific population or group in the
                    diagnosed population multiplied by 100 to express it as a
                    percentage.
                  </li>
                </ul>
              </li>
            </ul>
            <p id='hiv_stigma'>
              <b>HIV Stigma</b>
            </p>
            <p>
              HIV stigma, reported as a score, refers to the weighted median
              score on a 10 scale ranging from 0 (no stigma) to 100 (high
              stigma) among the number of persons aged 18 years and older
              diagnosed with HIV. This measurement captures four dimensions of
              HIV stigma: personalized stigma experienced during the past 12
              months, current concerns about disclosure, negative self-image,
              and perceived public attitudes towards people living with HIV.
            </p>
            <p>
              HIV stigma is crucial in understanding and addressing the
              challenges faced by individuals living with HIV. By examining
              stigma, we gain insights into the experiences of people with HIV
              about personalized stigma, concerns about disclosure, self-image,
              and societal attitudes. This information helps inform strategies
              and interventions to reduce stigma, promote social support, and
              improve the well-being of individuals living with HIV.
            </p>

            <ul>
              <li>
                All metrics related to HIV stigma, sourced from the CDC, are
                calculated based on a national probability sample of individuals
                diagnosed with HIV.
                <ul>
                  <li>
                    <b>Stigma score</b>: Calculating HIV stigma involves
                    determining the weighted median score on a 10 scale among a
                    national probability sample of people with diagnosed HIV.
                    The scores obtained from self-reported data are then
                    analyzed to assess the prevalence and impact of HIV stigma.
                    This method allows for the quantification and comparison of
                    stigma levels across different populations and geographic
                    areas, providing insights into the experiences of
                    individuals living with HIV.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <span id='medicare_cardiovascular'></span>
            <span id='medicare_hiv'></span>
            <span id='medicare_mental_health'></span>

            <HetHorizontalRuleHeading headingText='Medicare Medication Utilization' />

            <p>
              Data presented is from 2020 and is sourced directly from the
              Medicare Administrative Data and encoded based on the fields
              below. For these reports, the study population consists of
              Medicare fee-for-service beneficiaries ages 18+, continuously
              enrolled, and treated with a medication of interest during the
              measurement period. For more information refer directly to the{' '}
              <a href='https://www2.ccwdata.org/documents/10280/19022436/codebook-mbsf-abcd.pdf'>
                data dictionary
              </a>
              .
            </p>

            <table className='m-4 border-collapse border-solid border-bgColor p-1'>
              <thead className='bg-joinEffortBg1 font-bold'>
                <tr>
                  <th>Field from data dictionary</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody className='even:bg-exploreBgColor'>
                <tr>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    <b>RTI_RACE_CD</b>
                  </td>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    Beneficiary race code (modified using RTI algorithm). The
                    race of the beneficiary and enhanced based on first and last
                    name algorithms.
                  </td>
                </tr>
                <tr>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    <b>SEX_IDENT_CD</b>
                  </td>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    This variable indicates the sex of the beneficiary.
                  </td>
                </tr>
                <tr>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    <b>AGE_AT_END_REF_YR</b>
                  </td>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    This is the beneficiary’s age, expressed in years and
                    calculated as of the end of the calendar year, or, for
                    beneficiaries that died during the year, age as of the date
                    of death.
                  </td>
                </tr>
                <tr>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    <b>CST_SHR_GRP_CD</b>
                  </td>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    Monthly cost sharing group under Part D low-income subsidy.
                    Beneficiaries receiving the subsidy at any time during the
                    year were classified as LIS.
                  </td>
                </tr>
                <tr>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    <b>ENTLMT_RSN_CURR</b>
                  </td>
                  <td className='border-collapse border-solid border-bgColor p-1'>
                    Current reason for Medicare entitlement. This variable
                    indicates how the beneficiary currently qualifies for
                    Medicare.
                  </td>
                </tr>
              </tbody>
            </table>

            <h4>Medicare PQA Adherence</h4>
            <ul>
              <li>
                <b>Conditions</b>
                <ul>
                  <li>
                    <b>Renin Angiotensin System Antagonists</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-rasa'>
                      (PQA PDC-RASA)
                    </a>
                  </li>
                  <li>
                    <b>Statins</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-sta'>
                      (PQA PDC-STA)
                    </a>
                  </li>

                  <li>
                    <b>Beta-blockers</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-bb'>
                      (PQA PDC-BB)
                    </a>
                  </li>
                  <li>
                    <b>Calcium Channel Blockers</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-ccb'>
                      (PQA PDC-CCB)
                    </a>
                  </li>
                  <li>
                    <b>Adherence to Direct-Acting Oral Anticoagulants</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-doac'>
                      (PQA PDC-DOAC)
                    </a>
                  </li>
                  <li>
                    <b>Antiretroviral Medications</b>{' '}
                    <a href='https://www.pqaalliance.org/measures-overview#pdc-arv'>
                      (PQA PDC-ARV)
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <b>Metrics</b>
                <ul>
                  <li>
                    <b>Adherence Rate</b>: this rate measures the percentage of
                    Medicare fee-for-service beneficiaries 18 years and older
                    who met the Proportion of Days Covered (PDC) threshold of
                    80% for the indicated medication during the measurement
                    year.
                  </li>
                </ul>
              </li>
            </ul>

            <h4>Medicare NQF Adherence</h4>
            <ul>
              <li>
                <b>Conditions</b>
                <ul>
                  <li>
                    <b>
                      Persistence of Beta-Blocker Treatment After a Heart Attack
                    </b>{' '}
                    <a href='https://www.qualityforum.org/QPS/0071'>
                      (NQF 0071)
                    </a>
                  </li>
                  {SHOW_PHRMA_MENTAL_HEALTH && (
                    <li>
                      <b>
                        Adherence to Antipsychotic Medications For Individuals
                        with Schizophrenia
                      </b>{' '}
                      <a href='https://www.qualityforum.org/QPS/1879'>
                        (NQF 1879)
                      </a>
                    </li>
                  )}
                </ul>
              </li>
              <li>
                <b>Metrics</b>
                <ul>
                  <li>
                    <b>Adherence Rate</b>
                    <ul>
                      <li>
                        <b>
                          Persistence of Beta-Blocker Treatment After a Heart
                          Attack
                        </b>{' '}
                        measures the percentage of Medicare fee-for-service
                        beneficiaries 18 years and older during the measurement
                        year who were hospitalized and discharged with a
                        diagnosis of acute myocardial infarction (AMI) and who
                        received persistent beta-blocker treatment for six
                        months after discharge.
                      </li>
                      {SHOW_PHRMA_MENTAL_HEALTH && (
                        <li>
                          <b>
                            Adherence to Antipsychotic Medications For
                            Individuals with Schizophrenia
                          </b>{' '}
                          measures the percentage of Medicare fee-for-service
                          beneficiaries 18 years and older during the
                          measurement year with schizophrenia or schizoaffective
                          disorder who had at least two prescriptions filled for
                          any antipsychotic medication and who had a Proportion
                          of Days Covered (PDC) of at least 0.8 for
                          antipsychotic medications during the measurement
                          period (12 consecutive months)
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <h4>Medicare Disease Measures</h4>
            <ul>
              <li>
                <b>Conditions</b>
                <ul>
                  <li>
                    <b>HIV cases</b>
                  </li>
                  <li>
                    <b>Acute Myocardial Infarction (AMI) cases</b>
                  </li>
                  <li>
                    <b>Schizophrenia cases</b>
                  </li>
                </ul>
              </li>
              <li>
                <b>Metrics</b>
                <ul>
                  <li>
                    <b>Cases per 100k</b>: Rate of beneficiaries with the
                    specified disease per 100,000 beneficiaries.
                    <ul>
                      <li>
                        AMI defined as beneficiaries having 1+ medical claims
                        with ICD-10-CM of I21
                      </li>
                      <li>
                        HIV defined as beneficiaries having 1+ medical claims
                        with ICD-10-CM of B20.
                      </li>
                      {SHOW_PHRMA_MENTAL_HEALTH && (
                        <li>
                          Schizophrenia defined as beneficiaries having 1+
                          medical claims with ICD-10-CM of F20.
                        </li>
                      )}
                    </ul>
                  </li>
                  <li>
                    <b>Percent share</b>: this figure measures a particular
                    group's share of the total cases of the condition.
                  </li>
                  <li>
                    <b>Population percent</b>: this figure measures a particular
                    group's share of the total measured population: Medicare
                    fee-for-service beneficiaries 18 years and older.
                  </li>
                </ul>
              </li>
            </ul>

            <h4>Medicare Demographic Identifiers</h4>
            <p>
              <b>Race/ethnicity:</b> Medicare enhances the race and ethnicity of
              each beneficiary that has been used by the Social Security
              Administration and applies{' '}
              <a href='https://resdac.org/cms-data/variables/research-triangle-institute-rti-race-code'>
                an algorithm
              </a>{' '}
              that identifies more beneficiaries of Hispanic and Asian descent.
              Due to sample size constraints and data availability, we
              categorized racial/ethnic groups using the following groups, and
              have adjusted the wording in some cases to use more inclusive
              terminology and to correspond more closely with our other data
              sources.
            </p>
            <ul>
              <li>
                <code>Asian/Pacific Islander</code> we represent as{' '}
                <b>
                  Asian, Native Hawaiian, and Pacific Islander (Non-Hispanic)
                </b>
              </li>
              <li>
                <code>American Indian / Alaska Native</code> we represent as{' '}
                <b>American Indian and Alaska Native (Non-Hispanic)</b>
              </li>
              <li>
                <code>Non-Hispanic White</code> we represent as{' '}
                <b>White (Non-Hispanic)</b>
              </li>
              <li>
                <code>Black or African-American</code> we represented as{' '}
                <b>Black or African American (Non-Hispanic)</b>
              </li>
              <li>
                <code>Hispanic</code> we represent as <b>Hispanic or Latino</b>
              </li>
              <li>
                <code>Other</code> we represent as{' '}
                <b>Unrepresented race (Non-Hispanic)</b>
              </li>
              <li>
                <code>Unknown</code> we represent on our{' '}
                <HashLink
                  to={
                    '/exploredata?mls=1.medicare_cardiovascular-3.00&group1=All&demo=race_and_ethnicity#unknown-demographic-map'
                  }
                >
                  Unknown Demographic Map
                </HashLink>
              </li>
            </ul>

            <p>
              <b>Sex:</b> Medicare{' '}
              <a href='https://resdac.org/cms-data/variables/sex'>
                collects the sex of each beneficiary
              </a>
              as Unknown, Male, or Female.
            </p>

            <p>
              <b>Age:</b> Medicare provides the age of each beneficiary at the
              end of the reference year (i.e., 2020), or, for beneficiaries that
              died during the year,{' '}
              <a href='https://resdac.org/cms-data/variables/age-beneficiary-end-year'>
                age as of the date of death
              </a>
              . We categorized age into the following groups:
            </p>
            <ul>
              <li>18-39 years old</li>
              <li>40-64 years old</li>
              <li>65-69 years old</li>
              <li>70-74 years old</li>
              <li>75-79 years old</li>
              <li>80-84 years old</li>
              <li>85+ years old</li>
            </ul>

            <p>
              <b>Low-Income Subsidy Eligibility:</b> The Low-Income Subsidy
              (LIS) program for Medicare Part D beneficiaries provides subsidies
              to reduce or eliminate premiums and deductibles, and offers zero
              to reduced co-payments{' '}
              <a href='https://resdac.org/cms-data/variables/current-reason-entitlement-code'>
                for low-income Medicare Part D beneficiaries
              </a>
              . We categorized Medicare beneficiaries, who were eligible for the
              Part D LIS program, for 1 or more months during 2020 as “receiving
              Low Income Subsidy.” Medicare beneficiaries, who were{' '}
              <a href='https://resdac.org/cms-data/variables/monthly-cost-sharing-group-under-part-d-low-income-subsidy-january'>
                not eligible for the Part D LIS program
              </a>{' '}
              at any time during 2020 were classified as “not receiving Low
              Income Subsidy.”
            </p>

            <p>
              <b>Entitlement Qualification:</b> Medicare collects the reason for
              enrollment in Medicare. We categorized each beneficiary’s reason
              for Medicare enrollment as:
            </p>
            <ul>
              <li>Eligible due to age</li>
              <li>Eligible due to disability</li>
              <li>Eligible due to end-stage renal disease (ESRD)</li>
              <li>
                Eligible due to disability and end-stage renal disease (ESRD)
              </li>
            </ul>

            <Card className='bg-standardWarning px-8 py-4'>
              <MissingPhrmaData />
            </Card>
          </section>

          <section>
            <HetHorizontalRuleHeading
              id='svi'
              headingText='Social Vulnerability Index (SVI)'
            />

            <aside
              aria-label='Equity implications of SVI score'
              className='bg-standardInfo px-8 py-4 shadow-raised-tighter'
            >
              The measurement of social vulnerability grants policymakers,
              public health officials, and local planners the ability to
              effectively decide how to best protect their most vulnerable
              communities in case of a natural disaster or public health crisis.
              This advances health equity by ensuring that the communities that
              need resources the most, in times of devastation, receive them.
            </aside>

            <p>
              Percentile ranking values range from 0 to 1. The scores are given
              a ranking of low, medium, or high.
            </p>
            <ul>
              <li>
                Scores ranging from 0-0.33 are given a{' '}
                <b>low level of vulnerability.</b>
              </li>
              <li>
                Scores ranging from 0.34-0.66 are given a{' '}
                <b>medium level of vulnerability.</b>
              </li>
              <li>
                Scores ranging from 0.67-1 are given a{' '}
                <b>high level of vulnerability.</b>
              </li>
            </ul>
            <p>
              Tracts in the top 10%, i.e., at the 90th percentile of values, are
              given a value of 1 to indicate high vulnerability. Tracts below
              the 90th percentile are given a value of 0.
            </p>
          </section>
          <section>
            <HetHorizontalRuleHeading
              id='incarceration'
              headingText='Incarceration'
            />

            <aside
              aria-label='Equity implications of incarceration'
              className='bg-standardInfo px-8 py-4 shadow-raised-tighter'
            >
              <p>
                Incarceration is influenced by a blend of political forces,
                laws, and public opinion. Laws that govern sentencing policies
                and disenfranchisement of convicted felons are some of the
                political forces that determine voter participation in the
                justice-involved population.
              </p>
              <p>
                The ability to vote has been described as{' '}
                <a href={urlMap.repJohnLewisTweet}>
                  the singular most powerful, non-violent tool in American
                  democracy
                </a>
                . As of 2020, an estimated 5.17 million people were
                disenfranchised because of a prior felony conviction with
                minority populations of voting age being disproportionately
                represented.{' '}
                <a href={urlMap.deniedVoting}>(Sentencing Project)</a>
              </p>
              <p>
                <a href={urlMap.aafp}>Studies have also shown</a> that
                incarceration increases the prevalence of chronic health
                conditions, infectious diseases such as HIV/ AIDS, mental
                illnesses and substance use disorders. Incarceration has also
                been{' '}
                <a href={urlMap.rwjf}>
                  shown to cause a reduction in life expectancy
                </a>
                , with each year spent in prison corresponding to 2 years of
                reduced life expectancy.
              </p>
              <p>
                The impact of incarceration on the health of the justice
                involved lingers long after the period of incarceration is over.
                Upon reentry into society, the lack of adequate access to
                healthcare and the resources that engender health such as health
                insurance coverage, housing, employment, the lack of
                opportunities for upward advancement etc. further exacerbates
                the health inequities experienced by this group.
              </p>
            </aside>

            <p>
              <b>Data Sources</b>
            </p>

            <p>
              The Bureau of Justice Statistic (BJS) releases a variety of
              reports on people under correctional control; by combining tables
              from two of these reports (
              <a href={urlMap.bjsPrisoners}>“Prisoners in 2020”</a> and{' '}
              <a href={urlMap.bjsCensusOfJails}>“Census of Jails 2005-2019”</a>
              ), we are able to generate reports on individuals (including
              children) incarcerated in <b>Prison</b> and <b>Jail</b> in the
              United States at a national, state, and territory level.
              Additionally, the{' '}
              <a href={urlMap.veraGithub}>Vera Institute for Justice</a> has
              done extensive research and analysis of the BJS and other data
              sources to provide county level jail and prison incarceration
              rates.
            </p>

            <ul>
              <li>
                <b>National by Age:</b> Prisoners Table 10
              </li>

              <li>
                <b>State by Age:</b> Prisoners Table 2 (totals only)
              </li>

              <li>
                <b>National by Race:</b> Prisoners Appendix Table 2
              </li>

              <li>
                <b>State by Race:</b> Prisoners Appendix Table 2
              </li>

              <li>
                <b>National by Sex:</b> Prisoners Table 2
              </li>

              <li>
                <b>State by Sex:</b> Prisoners Table 2
              </li>
              <li>
                <b>All State and National Reports:</b> Prisoners Table 13
                (children in prison alert)
              </li>
              <li>
                <b>All Territories:</b> Prisoners Table 23 (totals only)
              </li>
              <li>
                <b>All County Reports:</b> Vera Incarceration Trends
              </li>
            </ul>

            <p>
              <b>Jail</b>
            </p>

            <p>
              Jail includes all individuals currently confined by a local, adult
              jail facility, but does not include individuals who are supervised
              outside of jail or who report only on weekends. In general, jail
              facilities incarcerate individuals who are awaiting trial or
              sentencing, or who are sentenced to less than 1 year.
            </p>

            <ul>
              <li>
                County reports: Vera data, which we use for our county level
                reports, restricts both the measured jail population and the
                relevant total population to individuals aged <b>15-64</b>.
              </li>
            </ul>

            <p>
              <b>Prison</b>
            </p>

            <p>
              In general, prisons incarcerate individuals who have been
              sentenced to more than 1 year, though in many cases prison can
              have jurisdictional control of an individual who is confined in a
              jail facility. Due to this overlap, we are currently unable to
              present accurate rates of combined incarceration.
            </p>

            <p>
              Jurisdiction refers to the legal authority of state or federal
              correctional officials over a incarcerated person, regardless of
              where they are held. Our ‘Sex’ and ‘Race’ reports present this
              jurisdictional population, while our ‘Age’ reports (due to the
              limitations in the data provided by BJS) only display the{' '}
              <b>sentenced</b> jurisdictional population.{' '}
            </p>

            <p>
              Data presented for prison differs slightly by geographic level and
              by data type:
            </p>

            <ul>
              <li>
                National report: Prison includes all individuals under the
                jurisdiction of a state or federal adult prison facility in the
                United States, but not inclusive of territorial, military, or
                Indian Country facilities. This data is disaggregated by
                race/ethnicity, age, and sex.
              </li>

              <li>
                State reports: Prison includes all individuals including under
                the jurisdiction of that state’s adult prison facilities. This
                data is disaggregated by race/ethnicity and sex, however the BJS
                Prisoners report does not provide age disaggregation to the
                state level.
              </li>
              <li>
                Territory reports: All individuals under the jurisdiction of
                that territory’s adult prison facilities. Because{' '}
                <b>American Samoa</b> did not report a value for jurisdictional
                population, we have used their value for custodial population
                instead. This data is not disaggregated by any demographic
                breakdown. All incarcerated people in the U.S. territories are
                counted under <b>Prison</b>.
              </li>
              <li>
                County reports: All individuals under the under the jurisdiction
                of a state prison system on charges arising from a criminal case
                in a specific county.
              </li>
            </ul>

            <p>
              The race/ethnicity breakdowns provided match those used in the ACS
              population source, however we do combine the BJS’s{' '}
              <b>Did not report</b> race values into our <b>Unknown</b> race
              group.{' '}
            </p>

            <p>
              <b>Children in Adult Facilities</b>
            </p>
            <p>
              When presenting incarceration reports, we have chosen to highlight
              the total number of confined children (in adult facilities),
              rather than only including this information as our standard “per
              100k” rate. This decision was based on several factors:
            </p>

            <ul>
              <li>
                The lack of federal law regarding the maximum age of juvenile
                court jurisdiction and transfer to adult courts coupled with the
                variance in state-specific laws makes it unfeasible to derive an
                accurate population base for individuals that may be
                incarcerated in an adult prison or jail facility. Because of
                this, any rate calculations for <b>0-17</b> are comparing the{' '}
                <b>number of prisoners under 18</b> proportional to the entire
                population of children down to newborns, resulting in a diluted
                incidence rate. This can be seen on national and state-level
                jail reports, as BJS provides these figures directly. In other
                reports, we have chosen not to calculate the incidence rate and
                instead rely on the total number of confined children to
                highlight this health inequity.
              </li>
              <li>
                The prison numbers presented in the BJS Prisoners 2020 report
                for juveniles include <b>confined</b> population (literally held
                within a specific facility), as opposed to the other prison
                reports which present the <b>jurisdictional</b> population
                (under the control of a facility but potentially confined
                elsewhere).
              </li>
            </ul>

            <p>
              <b>Combined Systems</b>
            </p>

            <p>
              <>
                <>Alaska</>, <>Connecticut</>, <>Delaware</>, <>Hawaii</>,{' '}
                <>Rhode Island</>, and <>Vermont</> each operate an integrated
                system that combines both prisons and jails; for our reports
                these are treated only as prison facilities.
              </>{' '}
              In addition, Alaska contracts with a small network of private
              jails, which are included here only as jail facilities.
            </p>
          </section>

          <section>
            <HetHorizontalRuleHeading headingText='Visualizations' />
            <p>
              Please consider the impact of under-reporting and data gaps when
              exploring the visualizations. These issues may lead to incorrect
              conclusions, e.g. low rates in a given location may be due to
              under-reporting rather than absence of impact.
            </p>
          </section>
        </article>

        <article className='pb-6'>
          <h2
            className='text-left font-serif text-smallestHeader font-light text-altBlack'
            id='metrics'
          >
            What do the metrics on the tracker mean?
          </h2>
          <div className='text-left font-sansText text-text'>
            <p>
              In the definitions below, we use <b>COVID-19 cases</b> as the
              variable, and <b>race and ethnicity</b> as the demographic
              breakdown for simplicity; the definitions apply to all topics and
              demographic breakdowns.
            </p>
            <ul>
              <li>
                <b>Total COVID-19 cases per 100k people</b>: The total rate of
                occurrence of COVID-19 cases expressed per 100,000 people (i.e.
                10,000 per 100k implies a 10% occurrence rate). This metric
                normalizes for population size, allowing for comparisons across
                demographic groups. This metric is rounded to the nearest
                integer in the tracker.
              </li>
              <li>
                <b>
                  Share of total COVID-19 cases with unknown race and ethnicity
                </b>
                : Within a locale, the percentage of COVID-19 cases that
                reported unknown race/ethnicity. For example, a value of 20% for
                Georgia means that 20% of Georgia’s reported cases had unknown
                race/ethnicity. This metric is rounded to one decimal place. In
                instances where this would round to 0%, two decimal places are
                used.
              </li>
              <li>
                <b>Share of total COVID-19 cases</b>: The percentage of all
                COVID-19 cases that reported a particular race/ethnicity,
                excluding cases with unknown race/ethnicity. This metric is
                rounded to one decimal place. In instances where this would
                round to 0%, two decimal places are used.
              </li>
              <li>
                <b>Population share</b>: The percentage of the total population
                that identified as a particular race/ethnicity in the ACS
                survey. This metric is rounded to one decimal place. In
                instances where this would round to 0%, two decimal places are
                used.
              </li>
              <li>
                <b>Relative inequity for COVID-19 cases</b>: To demonstrate the
                often inequitable distribution of a condition or disease, we
                calculate each demographic group’s relative inequity using the{' '}
                <code>(OBSERVED - EXPECTED) / EXPECTED</code>. In this case,{' '}
                <code>OBSERVED</code> is each group's percent share of the
                condition, and <code>EXPECTED</code> is that group's share of
                the total population. This calculation is done for every point
                in time for which we have data, allowing visualization of
                inequity relative to population, over time.
                <p>
                  {' '}
                  As an example, if in a certain month White (Non-Hispanic)
                  people in Georgia had 65.7% share of COVID-19 deaths but only
                  52.7% share of the population, their disproportionate percent
                  share would be <b>+13%</b>: <code>65.7% - 52.7% = +13%</code>.
                  This value is then divided by the population percent share to
                  give a proportional inequitable burden of <b>+24.7%</b>:{' '}
                  <code>+13% / 52.7% = +24.7%</code>. In plain language, this
                  would be interpreted as{' '}
                  <i>
                    “Deaths of individuals identifying as White, Non Hispanic in
                    Georgia from COVID-19 were almost 25% higher than expected,
                    based on their share of Georgia’s overall population.”
                  </i>
                </p>
              </li>
            </ul>
          </div>
        </article>
        <article className='pb-6'>
          <h2 className='text-left font-serif text-smallestHeader font-light text-altBlack'>
            What do the condition topics on the tracker mean?
          </h2>
          <div className='text-left font-sansText text-text'>
            <DefinitionsList
              dataTypesToDefine={Object.entries(METRIC_CONFIG)}
            />
            <p>
              Links to the original sources of data and their definitions can be
              found on our{' '}
              <Link to={DATA_CATALOG_PAGE_LINK}>Data Downloads</Link> page.
            </p>
          </div>
        </article>
        <article className='pb-6'>
          <h2 className='text-left font-serif text-smallestHeader font-light text-altBlack'>
            What do the race/ethnicity groups mean?
          </h2>
          <div className='text-left font-sansText text-text'>
            <p>
              The combined race/ethnicity groups shown on the tracker can be
              hard to understand, partially due to non-standard race/ethnicity
              breakdowns across data sources. Generally, all race/ethnicities on
              the tracker include Hispanic/Latino unless otherwise specified.
            </p>
            <p>
              We include a few example groups and definitions below. Note that
              the complete definition of a race/ethnicity can only be understood
              in the context of a particular dataset and how it classifies
              race/ethnicity (e.g. the presence of "Other" within a dataset
              changes who might be classified as "Asian" vs. "Other").
            </p>
            <ul>
              <li>
                <b>All</b>: Any race or ethnicity, including unknown
                race/ethnicity.
              </li>
              <li>
                <b>American Indian and Alaska Native (NH)</b>: A person having
                origins in any of the original peoples of North and South
                America (including Central America), who maintains tribal
                affiliation or community attachment, and who is not
                Hispanic/Latino.
              </li>
              <li>
                <b>Asian (NH)</b>: A person having origins in any of the
                original peoples of the Far East, Southeast Asia, or the Indian
                subcontinent including, for example, Cambodia, China, India,
                Japan, Korea, Malaysia, Pakistan, the Philippine Islands,
                Thailand, and Vietnam, and who is not Hispanic/Latino.
              </li>
              <li>
                <b>Black or African American (NH)</b>: A person having origins
                in any of the Black racial groups of Africa, and who is not
                Hispanic/Latino.
              </li>
              <li>
                <b>Hispanic/Latino</b>: Any race(s), Hispanic/Latino.
              </li>
              <li>
                <b>Middle Eastern / North African (MENA)</b>: Race/ethnicity
                grouping collected by CAWP but not currently collected by the
                U.S. Census.
              </li>
              <li>
                <b>Native Hawaiian or Other Pacific Islander (NH)</b>: A person
                having origins in any of the original peoples of Hawaii, Guam,
                Samoa, or other Pacific Islands and who is not Hispanic/Latino.
              </li>
              <li>
                <b>Unrepresented race (NH)</b>: A single race not tabulated by
                the CDC, not of Hispanic/Latino ethnicity. Individuals not
                identifying as one of the distinct races listed in the source
                data, or multiracial individuals, are grouped together as “Some
                other race”. This is a problem as it obscures racial identity
                for many individuals. In our effort to take transformative
                action towards achieving health equity the Satcher Health
                Leadership Institute has decided to rename this category to
                highlight it as a health equity issue. For PrEP coverage,
                Unrepresented race (NH) is used to recognize individuals who do
                not identify as part of the Black, White, or Hispanic ethnic or
                racial groups.
              </li>
              <li>
                <b>Two or more races (NH)</b>: Combinations of two or more of
                the following race categories: "White," "Black or African
                American," American Indian or Alaska Native," "Asian," Native
                Hawaiian or Other Pacific Islander," or "Some Other Race", and
                who are not Hispanic/Latino.
              </li>
              <li>
                <b>Two or more races & Unrepresented race (NH)</b>: People who
                are either multiple races or a single race not represented by
                the data source’s categorization, and who are not
                Hispanic/Latino.
              </li>
              <li>
                <b>White (NH)</b>: A person having origins in any of the
                original peoples of Europe, the Middle East, or North Africa,
                and who is not Hispanic/Latino.
              </li>
            </ul>
          </div>
        </article>

        <article className='pb-6'>
          <div className='rounded-md bg-infobarColor px-2 py-1 text-small'>
            <p>
              Do you have information on health outcomes at the state and local
              level that belong in the Health Equity Tracker?
              <br />
              <LinkWithStickyParams to={CONTACT_TAB_LINK}>
                We would love to hear from you!
              </LinkWithStickyParams>
            </p>
          </div>
        </article>
      </div>
    </>
  )
}
