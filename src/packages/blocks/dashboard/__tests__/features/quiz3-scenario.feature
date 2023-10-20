Feature: quiz3

    Scenario: User navigates to quiz3
        Given I am a User loading quiz3
        When I navigate to the quiz3
        Then quiz3 will load with out errors
        And Quiz3 will display messages
        And Quiz3 will display notifcation if no messages
        And Quiz3 will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test for show quiz modal
        Given I am a User attempting to quiz
        When I am user try to attempting quiz
        Then I can attempt the quiz

        Scenario: test for you win quiz3
        Given I am a User navigate to quiz3 win
        When I am user try to load quiz3 win
        Then I win the quiz3

    Scenario: test for you loss quiz3
        Given I am a User navigate to quiz3 loss
        When I am user try to load quiz3 loss
        Then I loss the quiz3

    Scenario: test for clicked quiz3 options
        Given I can see quiz3 options
        When I am user try to click one oaption of quiz3
        Then I  clicked wrong  answer
        And I can clicked right answer
        And I can clicked right answer 2
        And I  clicked q2 wrong  answer
        And I can clicked q2 right answer
        And I can clicked q2 right answer 2
