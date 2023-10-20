Feature: CfActiveCameraTracker

    Scenario: User navigates to CfActiveCameraTracker
        Given I am a User loading CfActiveCameraTracker
        When I navigate to the CfActiveCameraTracker
        Then CfActiveCameraTracker will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors