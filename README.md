# CLS Demo with React + TypeScript + Vite

This project demonstrates Cumulative Layout Shift (CLS) using React, TypeScript, and Vite. It provides examples of both good and bad CLS practices, allowing developers to understand and visualize the impact of CLS on user experience.

## Features

- Demonstrates both good and bad CLS examples
- Uses React with TypeScript for type safety
- Built with Vite for fast development and building
- Configurable image load delay via URL parameters
- Styled with Tailwind CSS for responsive design

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

## Usage

The application demonstrates CLS behavior with a delayed image load. You can control the CLS/LCP delay using URL parameters:
- Custom delay: `http://localhost:3000/?delay=0` (no delay)
- Custom delay: `http://localhost:3000/?delay=5000` (sets a 5-second delay)


## Project Structure

- `src/App.tsx`: Main application component
- `src/components/DelayedImage.tsx`: Component for delayed image loading

## Deployment

You can deploy this Vite project with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

### Deploying From Your Terminal

You can deploy your project with a single command using [Vercel CLI](https://vercel.com/download):

```shell
$ vercel
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Web Vitals: Cumulative Layout Shift (CLS)](https://web.dev/cls/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
