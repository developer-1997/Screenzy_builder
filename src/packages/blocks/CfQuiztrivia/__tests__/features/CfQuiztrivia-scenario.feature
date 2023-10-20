Feature: CfQuiztrivia

    Scenario: User navigates to CfQuiztrivia
        Given I am a User loading CfQuiztrivia
        When I navigate to the CfQuiztrivia
        Then CfQuiztrivia will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors