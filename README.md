# Blue Quartz
A very small anonymous chat application

---

## Installation

### Frontend

1. Requirements
    - Yarn >= 3.3.0
    - NodeJS >= 18.6
    - React >= 18.2.0
    - NextJS >= 9.1.2

2. Setup
    2.1. Install Dependencies

    ```bash
    yarn install
    ```

    2.2. Run Frontend
    
    - Run Compiled
        ```bash
        # Compile
        yarn build
        
        # Run
        yarn start
        ```
    
    - Run Directly
        ```bash
        # Using next
        yarn next start

        # Using yarn's alias
        yarn run next
        ```
    
    2.3. Disable Next's telemetry (optional)
    ```bash
    yarn next telemetry disable
    ```

### Backend

1. Requirements
    - Python >= 3.11.0

2. Setup
    2.1. Install dependencies
    - Note: Using a virtual environment is prefered.

    ```bash
    # Using py
    py -3.11 -m pip install -r requirements.txt

    # Using python prefix
    python3.11 ./main.py
    ```

    2.2. Run Backend API
    
    ```bash
    # Using py
    py -3.11 main.py

    # Using python prefix
    python3.11 ./main.py

    # Using uvicorn
    uvicorn main:app

    # Using uvicorn with py
    py -3.11 -m uvicorn main:app
    ```

    - For development it is recommended to run the server as follows
    ```bash
    python3.11 -m uvicorn main:app --reload --port <port>
    py -3.11 -m uvicorn main:app --reload --port <port>
    ```