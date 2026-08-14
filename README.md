# EchoTask — Voice-to-Task Application

EchoTask is a voice-driven task management application that converts natural-language voice commands into structured tasks. Users can speak a command such as:

> "Remind me to call John tomorrow at 5 PM."

The application processes the voice input, identifies the task, date, and time, and presents the result in a structured format.

## Features

* Voice command capture
* Speech-to-text conversion
* AI-based task and information extraction
* Automatic identification of task, date, and time
* Structured task display
* Local task storage
* Simple and responsive user interface

## Application Workflow

```text
Voice Input
    ↓
Speech-to-Text
    ↓
AI / Natural Language Processing
    ↓
Task, Date & Time Extraction
    ↓
Local Storage
    ↓
Structured Task Display
```

## Example

**Voice Command**

```text
Remind me to call John tomorrow at 5 PM.
```

**Extracted Task**

```text
Task: Call John
Date: Tomorrow
Time: 5:00 PM
```

## Technology Stack

* React Native
* JavaScript / TypeScript
* Speech-to-Text / Voice Recognition
* AI / Natural Language Processing
* Local Storage
* GitHub

## Architecture

The application follows a modular architecture separating the user interface, voice-processing logic, AI/task extraction, and local data management.

```text
User Interface
      ↓
Voice Input Layer
      ↓
Speech Recognition
      ↓
Task Extraction Service
      ↓
Local Storage
      ↓
Task Display
```

## Setup

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd <PROJECT-NAME>
```

Install dependencies:

```bash
npm install
```

Start the React Native application:

```bash
npx expo start
```

or, for a React Native CLI project:

```bash
npx react-native start
```

Follow the platform-specific instructions to run the application on Android or iOS.

## Third-Party Libraries & Services

The project uses third-party libraries and services for functionality such as:

* Voice recognition / speech-to-text
* AI-based natural-language processing
* React Native UI components
* Local data storage

The exact libraries and AI services used are listed in `package.json` and should be documented here according to the final implementation.

## Source Code

The complete source code is available through this GitHub repository.

```text
GitHub Repository:
<YOUR-GITHUB-REPOSITORY-URL>
```

## Live Demo

A web preview of the application is available at:

https://speak-task-magic-32.lovable.app

## Project Objective

The objective of EchoTask is to provide a faster and more natural way of creating tasks by allowing users to communicate with the application through voice instead of manually entering task information.

## Submission Compliance

| Requirement           | Implementation                              |
| --------------------- | ------------------------------------------- |
| React Native          | React Native application                    |
| Clean Code            | Modular and maintainable structure          |
| Scalable Architecture | Separated UI, processing and storage layers |
| README                | Setup, implementation and usage documented  |
| Source Code           | GitHub repository / ZIP submission          |
| Third-Party Services  | Libraries and AI services documented        |

## Project Status

**Status:** Academic Project / Prototype

**Application:** EchoTask — Voice-to-Task Application

**Live Preview:** https://speak-task-magic-32.lovable.app
