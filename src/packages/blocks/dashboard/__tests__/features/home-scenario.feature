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
   
