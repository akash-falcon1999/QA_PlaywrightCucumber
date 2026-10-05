@ui
Feature: WealthRamp dashboard and report

  Scenario: Dashboard loads with default plan
    Given I open the WealthRamp app
    Then the dashboard shows invested, returns and maturity values
    And the donut and bar charts are visible

  Scenario Outline: Maturity value matches independently computed SIP formula
    Given I open the WealthRamp app
    When I plan a SIP of <monthly> at <rate> percent for <years> years
    Then the maturity value equals the formula result within 1 rupee

    Examples:
      | monthly | rate | years |
      | 10000   | 12   | 10    |
      | 25000   | 8    | 15    |
      | 5000    | 15   | 20    |

  Scenario: Charts render valid non-zero data
    Given I open the WealthRamp app
    When I plan a SIP of 10000 at 12 percent for 10 years
    Then both donut slices are greater than zero
    And the bar chart has 10 bars with strictly increasing balances

  Scenario: Yearly report respects the filter
    Given I open the WealthRamp app
    When I plan a SIP of 10000 at 12 percent for 10 years
    And I open the yearly report and show the first 5 years
    Then the report has 5 rows

  Scenario Outline: Invalid input is rejected
    Given I open the WealthRamp app
    When I enter <value> as the monthly SIP
    Then I see the validation error "Enter 500 to 1,000,000"

    Examples:
      | value   |
      | 100     |
      | 5000000 |
