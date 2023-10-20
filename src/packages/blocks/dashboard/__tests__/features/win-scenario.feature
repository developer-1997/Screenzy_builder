Feature: win

    Scenario: User navigates to win
        Given I am a User loading win
        When I navigate to the win
        Then win will load with out errors
        And Win will display messages
        And Win will display notifcation if no messages
        And Win will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test For Input field
        Given I am a User Loading win screen
        When I am user try to fill input field
        Then I can enter my Name with out errors
        And I can enter my Number with out errors
        And I can enter my Email with out errors
        And I win the quiz
        And I win the quiz press

    Scenario: test for clicked quiz1 right option
        Given I can see quiz1 options
        When I am user try to click one option of quiz1
        Then I can change my mobile number