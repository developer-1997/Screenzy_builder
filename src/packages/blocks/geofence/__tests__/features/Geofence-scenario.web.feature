Feature: Geofence

    Scenario: User navigates to Geofence
        Given I am a User loading Geofence
        When I navigate to the Geofence
        Then Geofence will load with out errors
        And I can render with VIEW without errors
        And open editor without errors
        And open editor without value
        And I can click backButton without errors
        And open editor and update
        And geofenceDataApiCallId api will return success
        And geofenceUpdateApiCallId api will return success
        And geofenceDeleteApiCallId api will return success
        And geofenceCreateApiCallId api will return success
        And I can leave the screen with out errors

