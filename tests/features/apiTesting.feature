Feature: API Testing
    Scenario Outline: Mock and Modify API Response
        Given I import <filename> file
        When I mock <tagsURL> api response
        When I modify <articleURL> api response
        Then I navigate to the <baseURL> website
        Then I will be able to see the mocked values in the website
        Examples:
            | filename | tagsURL | articleURL | baseURL |
            | "tags.json" | "https://conduit-api.bondaracademy.com/api/tags" | "*/**/api/articles*" | "https://conduit.bondaracademy.com/" |

        Scenario Outline: API Request
        Given I login to <baseURL> and Sign in with username: <username> and password: <password>
        When I post a new article through <articleURL> API
        Then I will be able to delete the new article in the website
        Examples:
            | baseURL | username | password | articleURL |
            | "https://conduit.bondaracademy.com/" | "ask123@test.com" | "ask123" | "https://conduit-api.bondaracademy.com/api/articles/" |
        