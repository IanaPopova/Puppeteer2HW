Feature: Booking cinema tickets

  Scenario: Should successfully book a regular ticket
    Given The user is on the cinema main page
    When The user selects a day
    And The user selects a movie
    And The user selects a regular seat
    And The user sees booking details
    And The user confirms the booking
    Then The user sees a confirmation as "Электронный билет"

  Scenario: Should successfully book a VIP ticket
    Given The user is on the cinema main page
    When The user selects a day
    And The user selects a movie
    And The user selects a VIP seat
    And The user sees booking details
    And The user confirms the booking
    Then The user sees a confirmation as "Электронный билет"

   Scenario: Should not allow booking a taken seat
    Given The user is on the cinema main page
    When The user selects a day
    And The user selects a movie
    And The user selects a regular seat
    And The user sees booking details
    And The user confirms the booking
    And The user returns to the main page
    And The user chooses the same day and seance
    Then The user sees the seat is taken
    And The booking button should be disabled