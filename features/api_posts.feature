@api
Feature: JSONPlaceholder POST /posts boundary and invalid data
  JSONPlaceholder is a mock API: it does not validate input and echoes payloads with 201.
  The suite asserts the contract that matters: no server-side (5xx) failures, and records actual behaviour.

  Scenario: Excessively long title does not cause a server error
    When I POST a post with a title of 10000 characters
    Then the response status is not a server error
    And the response is either a client error or an echo of the payload

  Scenario Outline: Special characters are handled safely
    When I POST a post with title "<title>"
    Then the response status is not a server error
    And the response is either a client error or an echo of the payload

    Examples:
      | title                          |
      | <script>alert(1)</script>      |
      | '; DROP TABLE posts; --        |
      | Unicode ✓ é 日本 %00 {{7*7}}     |

  Scenario: Missing userId is handled without server failure
    When I POST a post without a userId
    Then the response status is not a server error
    And the response is either a client error or an echo of the payload
