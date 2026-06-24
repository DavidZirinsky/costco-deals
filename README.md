app docs can be seen: https://97costco.fly.dev/docs#/

# TL;DW - AI-Powered YouTube Video Summaries

![TL;DW Logo](frontend/public/logo-tech.png)

**TL;DW** is a web application that saves you time by providing AI-powered summaries of YouTube videos. Paste a YouTube link and get the key takeaways instantly, without watching the whole video. See it in action [here](https://www.youtubetldw.com/)

This utilizes the python [tldw](https://github.com/DavidZirinsky/tl-dw/) library on the backend to get the YouTube summaries.

## ✨ Features

- **AI-Powered Summaries:** Get concise and accurate summaries of any YouTube video.
- **Streaming Responses:** See the summary generated in real-time.
- **Sleek Interface:** A modern and user-friendly interface for a smooth experience.
- **Time-Saving:** Avoids long intros, ads, and filler content to get straight to the point.

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Python](https://www.python.org/)
- **AI:** [OpenAI](https://openai.com/)
- **Deployment:** [Fly.io](https://fly.io/). 

Note on Fly: This was originally deployed in an AWS lambda, then GCS cloud run, then finally to Fly as I hoped that I could find a cloud provider who's IP range wasn't blocked by Youtube. I ended up going with a redisential proxy provider, but I kept the deployment in Fly given the generous egress traffic limit of ~160gb/month versus GCP's 1gb/month limit.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for local backend setup)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DavidZirinsky/tldw-site.git
    cd tldw-site
    ```

2.  **Setup Backend:**

    - Navigate to the backend directory: `cd backend`
    - Set up your environment variables by copying the example:
      ```bash
      cp .env.example .env
      ```
    - Fill in your `OPENAI_API_KEY` and other variables in the `.env` file.
    - Run the backend server:
      ```bash
      docker compose up -d && docker logs tldw -f
      ```

3.  **Setup Frontend:**
    - In a new terminal, navigate to the frontend directory: `cd frontend`
    - Install dependencies:
      ```bash
      pnpm install
      ```
    - Run the development server:
      ```bash
      pnpm run dev
      ```

## 🔍 Linting

To run the linter and check for code quality, run the following command in the `frontend` directory:

```bash
pnpm run lint
```

## 🔧 Troubleshooting

### Common Issues

- **"Module not found" errors**: Make sure you've run `pnpm install` in the frontend directory
- **Backend connection failed**: Ensure Docker is running and the backend container is up with `docker compose up -d`
- **OpenAI API errors**: Check that your `OPENAI_API_KEY` is correctly set in the `.env` file
- **Port already in use**: The frontend runs on port 3000 and backend on 8000. Kill any processes using these ports or change them in the configuration
- **Docker permission denied**: On Linux, you may need to run Docker commands with `sudo` or add your user to the docker group

## 🚀 Deployment

This project is configured for deployment on [Fly.io](https://fly.io/).

1.  **Create a Fly.io app:**

    ```bash
    fly apps create tl-dw
    ```

2.  **Import secrets:**
    Make sure your `.env` file is populated, then run:

    ```bash
    fly secrets import < .env
    ```

3.  **Deploy the application:**
    ```bash
    fly deploy
    ```

## 🤝 Contributing

We welcome contributions to TL;DW! Here's how you can help:

1. **Fork the repository** and create your feature branch from `main`
2. **Make your changes** following the existing code style and conventions
3. **Test your changes** by running the linter: `pnpm run lint` in the frontend directory
4. **Commit your changes** with a clear and descriptive commit message
5. **Push to your fork** and submit a pull request

### Development Guidelines

- Follow the existing code style and formatting
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Keep commits focused and atomic
- Write clear commit messages

For bug reports or feature requests, please open an issue on GitHub.
