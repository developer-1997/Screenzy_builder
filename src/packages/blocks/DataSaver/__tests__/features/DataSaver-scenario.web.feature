Feature: DataSaver

    Scenario: User navigates to DataSaver
        Given I am a User loading DataSaver
        When I navigate to the DataSaver
        Then DataSaver will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors