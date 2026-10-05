@selfheal-demo
Feature: Self-healing demo (EXPECTED TO FAIL - locators intentionally broken)

  Scenario: Locators broken on purpose
    Given I open the WealthRamp app
    Then the broken locators cannot be resolved
