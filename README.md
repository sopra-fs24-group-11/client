# **Get-Together - Client**

<img src="https://github.com/sopra-fs24-group-11/client/assets/120049684/1144ddc0-64e8-46fd-8ad7-16a8040692d7" alt="Get-Together Logo" style="width: 50%;" />

## Table of Content

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Main Components](#main-components)
- [Screenshots](#screenshots)
- [Launch & Deployment](#launch--deployment)
- [Roadmap](#roadmap)
- [Authors and Acknowledgment](#authors-and-acknowledgment)
- [License](#license)

## Introduction
Welcome to Get-Together! Our platform revolutionizes trip planning by providing users with intuitive tools to organize, share, and manage their journeys seamlessly. Whether you're coordinating a weekend getaway or a cross-country adventure, Get-Together enhances every step of the planning process, making it both efficient and enjoyable.

[Start planning your trip now!](http://sopra-fs24-group-11-client.oa.r.appspot.com/)

## Technologies Used
* [React](https://react.dev/) - JavaScript library for building user interfaces
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
* [React Router](https://reactrouter.com/) - Declarative routing for React

## Main Components

### 1. **Dashboard Component**
- **Description**: The main interface where users can see an overview of their activities (Friends, Notifications, CurrentTrips, Top-Friends, Level-Progress, etc.).
- **Role**: Acts as the central hub for navigating to other features of the application.
- **Main File**: [Dashboard.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/Dashboard.tsx)
- **Correlation**: Links to other views such as trip creation, customization, and user profile.

### 2. **Trip Management Components**
- **Choose Connection**: 
  - **Role**: Helps users select a connection for their trip by providing a desired starting point and choosing one of 5 public transport connections.
  - **Main File**: [ChooseConnection.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/ChooseConnection.tsx)
- **Create Trip**: 
  - **Role**: Allows users to create new trips by providing a name, description, destination and invite their friends.
  - **Main File**: [CreateTrip.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/CreateTrip.tsx)
- **Customize Trip**: 
  - **Role**: Provides options for users to customize their trip details and invite new friends or remove them.
  - **Main File**: [CustomizeTrip.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/CustomizeTrip.tsx)
- **Trip Overview**: 
  - **Role**: Displays an overview of a specific trip: Whats the progress of each trip member? When will they arrive? This includes an admin panel and (group) packing-list as well as a todo-list.
  - **Main File**: [TripOverview.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/TripOverview.tsx)

### 3. **User Profile Component**
- **Description**: Manages user information and preferences.
- **Role**: Enables users to view and edit their profiles (Name, E-mail, etc.) and choose an avatar.
- **Main File**: [UserProfile.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/UserProfile.tsx)

### 4. **Friends Management Component**
- **Description**: Manages user’s friends and social interactions (Who is my best friend? (most trips with him / her).
- **Role**: Allows users to view and manage their friends list and send / respond to friend requests.
- **Main File**: [FriendListPage.tsx](https://github.com/sopra-fs24-group-11/client/blob/main/src/components/views/FriendListPage.tsx)
- **Correlation**: Supports social aspects of the app, facilitating trip invitations and collaborative planning.

## Screenshots

<div style="display: flex; flex-wrap: wrap;">
    <img src="https://github.com/sopra-fs24-group-11/client/assets/120049684/4fcedda2-454d-4db6-b0f0-5f3de9bc0de5" alt="Screenshot 1" style="width: 49%; margin: 1%;">
    <img src="https://github.com/sopra-fs24-group-11/client/assets/120049684/0b3fc648-52d7-4316-8f84-b8b1f638bae9" alt="Screenshot 2" style="width: 49%; margin: 1%;">
    <img src="https://github.com/sopra-fs24-group-11/client/assets/120049684/18631aed-87cf-41ff-a306-2070c20eeab1" alt="Screenshot 3" style="width: 49%; margin: 1%;">
    <img src="https://github.com/sopra-fs24-group-11/client/assets/120049684/10c8500e-8b87-474a-94bf-2a9346a9a1f6" alt="Screenshot 4" style="width: 49%; margin: 1%;">
</div>

## Launch & Deployment
### Prerequisites
Install [Node.js](https://nodejs.org/) (v20.11.0) which comes with npm.

### Clone Repository
Clone the client-repository onto your local machine with Git.

```bash
git clone https://github.com/sopra-fs24-group-11/client.git
```

### Install Dependencies

```bash
npm install
```

### Run

```bash
npm run dev
```
You can verify that the client is running by visiting \`http://localhost:3000\` in your browser.

### Test

```bash
npm run test
```
We also recommend using [Postman](https://www.getpostman.com) to test your API endpoints.

### Build

```bash
npm run build
```

### Deployment
The main branch is automatically mirrored onto Google Cloud App Engine via GitHub workflow, each time you push onto the main branch.

## Roadmap
Potentially interesting additions to our project could be:
- Show some complex current location according to GPS or similar for each trip participant in the tripOverview.
- Adding car, bike, and other transportation options which are not covered in public transport.
- Make the app even more responsive for mobile screens.

## Authors and Acknowledgment

### Authors
* **Livio Hartmann** - [livio-h](https://github.com/livio-h)
* **Patrik Rosenkranz** - [pr-120](https://github.com/pr-120)
* **Jan Joos** - [jxnjo](https://github.com/jxnjo)
* **Marc Heinimann** - [Marc-Hei](https://github.com/Marc-hei)
* **Gabriel Stegmaier** - [gstegm](https://github.com/gstegm)

### Acknowledgments
We would like to thank our TA [Cédric](https://github.com/cedric-vr) and the whole team of the course Software Engineering Lab from the University of Zurich.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/sopra-fs24-group-11/client/blob/main/LICENSE) file for details.
