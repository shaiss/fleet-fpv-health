
# Drone Fleet Management Dashboard

A comprehensive web application for drone fleet management that allows uploading, visualization, and filtering of drone data from CSV files.

![Drone Fleet Dashboard - Statistics](public/lovable-uploads/938396bc-d2a7-4076-94f1-5f51128762bd.png)

## Features

- **CSV Upload**: Easily import your drone fleet data through CSV file uploads
- **Interactive Dashboard**: View key statistics and distribution charts for your fleet
- **Advanced Filtering**: Filter drones by multiple criteria including:
  - Status (Ready for field testing)
  - Drone type
  - Battery type
  - Text search across all fields
  - Custom column filters
- **Multiple Views**: Toggle between table and card views to visualize your fleet data
- **Selection System**: Select individual drones for batch operations
- **Responsive Design**: Works on desktop and mobile devices

![Drone Fleet Dashboard - Card View](public/lovable-uploads/99c48959-ab02-4093-b276-0af5dbd1460d.png)

## Technology Stack

This project is built with:

- **React**: UI library for building the interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling components
- **shadcn/ui**: Component library based on Radix UI
- **Recharts**: For data visualization
- **Vite**: For fast development and building

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd drone-fleet-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080` by default.

## Usage

1. **Upload a CSV file** containing your drone fleet data
   - The CSV should have headers matching the expected data structure
   - Required columns: id, quadName, camera, type, propSize, vtx, rcReceiver, transmitter, batteryType, readyForFieldTesting

2. **View the dashboard** showing statistics and visualizations of your fleet

3. **Filter and search** for specific drones using the filter controls

4. **Switch between views** using the table/card view toggle

## Data Structure

The application expects CSV data with the following structure:

| Column | Description |
|--------|-------------|
| id | Unique identifier for the drone |
| quadName | Name of the quadcopter |
| camera | Camera model/status |
| type | Drone type/model |
| propSize | Propeller size |
| vtx | Video transmitter details |
| rcReceiver | Remote control receiver |
| transmitter | Transmitter details |
| externalTransmitter | External transmitter information |
| txModelNum | Transmitter model number |
| batteryType | Type of battery used |
| videoChannel | Video channel information |
| flightTest | Flight test status |
| readyForFieldTesting | Field testing readiness (✓ for ready) |
| notes | Additional notes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project

**URL**: fleet-fpv-health.lovable.app

## Development

### Local Development

If you want to work locally using your own IDE, you can clone this repo and push changes:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev/projects/f047a98e-af44-48f8-bd6d-fb911ad570ff) and click on Share -> Publish.
