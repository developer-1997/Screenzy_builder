Feature: FacialTracking

    Scenario: User navigates to FacialTracking
        Given I am a User loading FacialTracking
        When I navigate to the FacialTracking
        Then FacialTracking will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors