Feature: quiz4

    Scenario: User navigates to quiz4
        Given I am a User loading quiz4
        When I navigate to the quiz4
        Then quiz4 will load with out errors
        And Quiz4 will display messages
        And Quiz4 will display notifcation if no messages
        And Quiz4 will display notifcation if API failure
        And I can leave the screen with out errors

    Scenario: test for show quiz modal
        Given I am a User attempting to quiz
        When I am user try to attempting quiz
        Then I can attempt the quiz
        
    Scenario: test for you win quiz4
        Given I am a User navigate to quiz4 win
        When I am user try to load quiz4 win
        Then I win the quiz4

    Scenario: test for you loss quiz4
        Given I am a User navigate to quiz4 loss
        When I am user try to load quiz4 loss
        Then I loss the quiz4

    Scenario: test for clicked quiz4 options
        Given I can see quiz4 options
        When I am user try to click one option of quiz4
        Then I  clicked wrong  answer
        And I can clicked right answer
        And I can clicked right answer 2
        And I clicked q2 wrong  answer
        And I can clicked q2 right answer
        And I can clicked q2 right answer 2
