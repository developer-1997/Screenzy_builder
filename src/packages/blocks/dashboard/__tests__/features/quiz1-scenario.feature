Feature: quiz1

    Scenario: User navigates to quiz1
        Given I am a User loading quiz1
        When I navigate to the quiz1
        Then quiz1 will load with out errors
        And Quiz1 will display messages
        And Quiz1 will display notifcation if no messages
        And Quiz1 will display notifcation if API failure
        And I can leave the screen with out errors
        
    Scenario: test for show quiz1 modal
        Given I am a User attempting to quiz1
        When I am user try to attempting quiz1
        Then I can attempt the quiz1

    Scenario: test for you win quiz1
        Given I am a User navigate to quiz1 win
        When I am user try to load quiz1 win
        Then I win the quiz1

    Scenario: test for you loss quiz1
        Given I am a User navigate to quiz1 loss
        When I am user try to load quiz1 loss
        Then I loss the quiz1

    Scenario: test for clicked quiz1 right option
        Given I can see quiz1 options
        When I am user try to click one option of quiz1
        Then I can clicked right answer

    Scenario: test for clicked quiz1 wrong options
        Given I can see quiz1 options
        When I am user try to click one option of quiz1
        And I can clicked wrong answer

    Scenario:  test for clicked quiz1 right option 2
        Given I can see quiz1 options
        When I am user try to click one option of quiz1
        Then I  clicked right  answer 2
        

        