Feature: quiz5

    Scenario: User navigates to quiz5
        Given I am a User loading quiz5
        When I navigate to the quiz5
        Then quiz5 will load with out errors
        And Quiz5 will display messages
        And Quiz5 will display notifcation if no messages
        And Quiz5 will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test for show quiz modal
        Given I am a User attempting to quiz
        When I am user try to attempting quiz
        Then I can attempt the quiz

        Scenario: test for you win quiz5
        Given I am a User navigate to quiz5 win
        When I am user try to load quiz5 win
        Then I win the quiz5

    Scenario: test for you loss quiz5
        Given I am a User navigate to quiz5 loss
        When I am user try to load quiz5 loss
        Then I loss the quiz5

    Scenario: test for clicked quiz5 options
        Given I can see quiz5 options
        When I am user try to click one oaption of quiz5
        Then I  clicked wrong  answer
        And I can clicked right answer
        And I can clicked right answer 2
        And I can clicked option 4
      