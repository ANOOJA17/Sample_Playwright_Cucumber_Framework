Feature: User Authentication tests

  Scenario Outline: Verify user Sign in with valid credentials
    Given I access the url 'https://conduit.bondaracademy.com/' and go to the Sign in page
    When I enter Username <username> and the Password <password> and submit the form
    Then I will be able to login

    Examples:
      | username                   | password   |
      | "ask123@test.com"          | "ask123"   |
      | "Testautomation@gmail.com" | "Test1234" |