Feature: Calculate directory size

  Scenario: Directory is empty
    Given an empty directory
    When I calculate its size
    Then the result should be 0

  Scenario: Directory with only files
    Given a directory with files of sizes 100 and 200
    When I calculate its size
    Then the result should be 300

  Scenario: Directory contains files and directories
    Given a directory with a file of size 67 and a subdirectory containing a file of size 1333
    When I calculate its size
    Then the result should be 1400