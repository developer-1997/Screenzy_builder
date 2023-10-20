Feature: quiz6

    Scenario: User navigates to quiz6
        Given I am a User loading quiz6
        When I navigate to the quiz6
        Then quiz6 will load with out errors
        And Quiz6 will display messages
        And Quiz6 will display notifcation if no messages
        And Quiz6 will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test for show quiz modal
        Given I am a User attempting to quiz
        When I am user try to attempting quiz
        Then I can attempt the quiz

    Scenario: test for you win quiz6
        Given I am a User navigate to quiz6 win
        When I am user try to load quiz6 win
        Then I win the quiz6

    Scenario: test for you loss quiz6
        Given I am a User navigate to quiz6 loss
        When I am user try to load quiz6 loss
        Then I loss the quiz6

    Scenario: test for clicked quiz6 options
        Given I can see quiz6 options
        When I am user try to click one oaption of quiz6
        Then I  clicked wrong  answer
        And I can clicked right answer
        And I can clicked right answer 2
    