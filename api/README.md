# Blue Quartz
A very small & anonymous chat application

---

## Backend Installation

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
