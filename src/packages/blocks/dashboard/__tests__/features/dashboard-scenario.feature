Feature: dashboard

  Scenario: User navigates to dashboard
    Given I am a User loading dashboard
    When I navigate to the dashboard
    Then dashboard will load with out errors

  Scenario: Get all videos
    Given I am a User loading dashboard
    When the getAllVideos API endpoint is called
    Then the response status code should be

  Scenario: Geofence data
    Given The app is launched
    When the geofence data endpoint is called
    Then should get an array containing geofence data

  Scenario: User navigates to dashboard1
    Given I am a User loading dashboard
    When I navigate to the dashboard
    Then dashboard will load with out errors
    And Dashboard will display messages
    And Dashboard will display notifcation if no messages
    And Dashboard will display notifcation if API failure
    And I can leave the screen with out errors

   
