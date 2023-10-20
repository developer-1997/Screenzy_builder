Feature: quiz2

    Scenario: User navigates to quiz2
        Given I am a User loading quiz2
        When I navigate to the quiz2
        Then quiz2 will load with out errors
        And Quiz2 will display messages
        And Quiz2 will display notifcation if no messages
        And Quiz2 will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test for show quiz modal
        Given I am a User attempting to quiz
        When I am user try to attempting quiz
        Then I can attempt the quiz

    Scenario: test for you win quiz2
        Given I am a User navigate to quiz2 win
        When I am user try to load quiz2 win
        Then I win the quiz2

    Scenario: test for you loss quiz1
        Given I am a User navigate to quiz1 loss
        When I am user try to load quiz1 loss
        Then I loss the quiz1

    Scenario: test for clicked quiz1 options
        Given I can see quiz1 options
        When I am user try to click one oaption of quiz1
        Then I  clicked wrong  answer
        And I can clicked right answer
        And I can clicked right answer 2
 