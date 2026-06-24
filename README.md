# 🏷️ Costco Deals - Browse Clearance & In-Warehouse Catalog

<img src="frontend/public/logo.png" alt="Costco Deals logo" height="300" />

**97cost.co** is a site that lets you browse Costco clearance deals that are in your warehouse and available online. You can also browse Costco's in-warehouse catalog to help you price shop and plan for what's available. 

See it in action [here](https://www.97cost.co/).

View the API docs [here](https://97costco.fly.dev/docs#/).

Under the hood this involved reverse engineering the Costco mobile API, you can find more about that [here](#prerequisites-getting-costco-auth-headers)

AI Disclosure: I used Gemini to help with the front end, the backend was all artisanally crafted by hand. As a backend focused developer, I find having a React project set up for me makes editing and getting a site off the ground a lot more manageable. I used Gemini as it's a model well known for it's React skills, and it was free, which was probably the biggest feature I needed.  

## ✨ Features

- **Clearance Deals:** Find .97 clearance deals specific to your local warehouse.
- **In-Warehouse Catalog:** Browse the full Costco catalog to price shop before visiting.
- **Location Based:** Persists your preferred warehouse for tailored results.
- **Reverse-Engineered API:** Directly hooks into the Costco mobile app API for real-time data.


## 🛠️ Tech Stack

- **Frontend:** [Vite](https://vitejs.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/), [Python](https://www.python.org/)
- **Deployment:** [Fly.io](https://fly.io/). 

Note on Fly: I've found that the smaller hosting companies tend to not have blanket IP range bans, and for a small app like this it was easier than terraform + an AWS lambda.  

## 🚀 Getting Started

### Prerequisites: Getting Costco Auth headers

So it turns out that with a mobile app, seeing what requests they're making is a *little* harder than pulling out dev tools on a desktop browser. How I went from app -> idiot-proofed curl commands was by doing the following:

1.  **Extract the APK:**
    Extract the apk from an Android device with Google Play, and transfer it to your desktop.

2.  **Modify the APK:**
    ```bash
    npm install -g apk-mitm
    apk-mitm Costco.apk
    ```

3.  **Boot up an Android emulator:**
    I used the Android Studio emulator. Install the modified apk on it (for the Android Studio emulator, I just drag and dropped it).

4.  **Run mitmweb:**
    ```bash
    ./mitmweb --mode regular@8082
    ```

5.  **Configure emulator proxy:**
    Go to the Extended Controls (the three dots on the emulator sidebar) -> Settings -> Proxy.

6.  **Set manual proxy:**
    Uncheck "Use Android Studio HTTP proxy settings", select Manual proxy configuration, and enter your computer's IP address and the proxy port.

7.  **Install the certificate:**
    Install the cert as a user cert on the emulator. You can view instructions from the Android emulator's browser by going to `http://mitm.it`.

8.  **Copy the API calls:**
    From the mitmproxy site, find the API calls and copy them as curl commands.

9.  **Update environment variables:**
    From there, you'll have the values for various requests to populate your `.env` file.


### Installation

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:DavidZirinsky/costco-deals.git
    cd costco-deals
    ```

2.  **Setup Backend:**

    - Navigate to the backend directory: `cd backend`
    - Set up your environment variables by copying the example:
      ```bash
      cp .env.example .env
      ```
    - Fill in the variables in the `.env` file.
    - Run the backend server:
      ```bash
      docker compose up -d && docker logs costco-deals -f
      ```

3.  **Setup Frontend:**
    - In a new terminal, navigate to the frontend directory: `cd frontend`
    - Install dependencies:
      ```bash
      npm install
      ```
    - Run the development server:
      ```bash
      npm run dev
      ```

## 🤝 Pre-commit Hooks

This project uses pre-commit hooks to ensure code quality and consistency before commits.

1.  **Install pre-commit:**
    If you don't have `pre-commit` installed globally, you can install it into your virtual environment:

    ```bash
    pip install pre-commit
    ```

2.  **Install the Git hooks:**
    Navigate to the root of the repository and run:

    ```bash
    pre-commit install
    ```

    This command sets up the hooks in your `.git/` directory.

3.  **Run hooks manually (optional):**
    To run all configured hooks against all files, without making a commit:
    ```bash
    pre-commit run --all-files
    ```

Now, every time you try to commit, the pre-commit hooks will automatically run. If any hook fails, the commit will be aborted, allowing you to fix the issues before committing.


## 🔧 Troubleshooting

### Common Issues

- **Backend connection failed**: Ensure Docker is running and the backend container is up with `docker compose up -d`
- **Missing Auth Headers**: If the API isn't returning data, ensure you've completed the [Prerequisites](#prerequisites-getting-costco-auth-headers) to get the necessary `.env` variables from the Costco app.
- **Port already in use**: The frontend runs on port 5173 (Vite default) and backend on 8000. Kill any processes using these ports or change them in the configuration.

## 🚀 Deployment

This project is configured for deployment on [Fly.io](https://fly.io/).

1.  **Create a Fly.io app:**

    ```bash
    fly apps create 97costco
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

We welcome contributions to Costco Deals! Here's how you can help:

1. **Fork the repository** and create your feature branch from `main`
2. **Make your changes** following the existing code style and conventions
3. **Test your changes** by running the linter: `pre-commit run --all-files` in the root directory
4. **Commit your changes** with a clear and descriptive commit message
5. **Push to your fork** and submit a pull request

### Development Guidelines

- Follow the existing code style and formatting
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Keep commits focused and atomic
- Write clear commit messages

For bug reports or feature requests, please open an issue on GitHub.
