#Porject Setup

1. Clone the repository
2. Install dependencies
    ```bash
    npm install
    ```
3. Set up environment variables
4. Run migrations
    ```bash
    npm run seed
    ```
5. Start the server
    ```bash
    npm run dev:server
    ```
6. Start the frontend
    ```bash
    npm run dev
    ```
7. Test the application
    ```bash
    npm run test
    ```

For Postman collection check url : https://documenter.getpostman.com/view/10236578/2sAYkHoxvb#1ba851b8-7f7c-493b-93aa-283914dd8074

For docker
1. Build the image
    ```bash
    docker build -t contest-participation-system .
    ```
2. Run the container
    ```bash
    docker run -d -p 5000:5000 -p 5174:5174 --name contest-participation-system contest-participation-system
    ```
3. Stop the container
    ```bash
    docker stop contest-participation-system
    ```
4. Remove the container
    ```bash
    docker rm contest-participation-system
    ```


    For architecture check url : https://mermaid.live/view#pako:eNp9lOGO0kAQx19lssklZ6Qm-BETE2hBNByelIuJLR-W7lxZr90lu1sVr_cKvoKP4Kv5CM62ID1I6Aco0_9_Z-Y3Ux5ZpgWyAcsN325gGb1JFdB1dQV_f__6A5PFx_lyPI_a6DCZGK0cKgEBLJBn7tVXu4IgeFsPb99DyIvC1jBKRjx7aEXjH1uD1npZe0T7aat1mzBlB22M5pvM0ML1nCoiA7zsuF-krHX6a9RkvLNoIOKO1xAmN1rlOqIH0Nxpi6tTfcizDe4NUbJAIS3JfVSq_Ew903lO8RrGyWeprNMKfAjNmTLGrDLS7WqYJNgWHBjuMChkKR11McWiRHdEcLSOjdEGplyJosn1LgkrSlXCjRSiwO_cnLfheeVGV4Tsg14T7mmiCFiQ0WSon2FFfsouYMntwyElAU7VGXrPYs0twozv0HQJh21nThsEz9n2IPSDt47uPlX0LbWi3GH_P_lQFwVmTfxi0j3w85xRZ0oz5ALNWnMjjplpbP393JrKOmiiPpmb3v3OSLPzZ0F0qY4TjnAdU2JRFQdyzzZu2u54cz4ZjhVN-8ndVhBv2HNYnZoiaZ2R64okt0b-RG96fTA1O9yGz4xhgdy07VBNDZf6cksdahDvrMPy2Uz7zbETdNkG4owAUimzpGuiDZdZp5BZZyRSQcPeT-FU4d9dhAm3jjR2SytApY46pbIeK9GUXAr6q3n0D1LmNlhiygZ0K_CeV4Xz1T6RlBPneKcyNnCmwh6jKeUbNrjnhaVfVYMukpzaLg-SLVdftC73oqd_vrWIPg

    https://mermaid.live/view#pako:eNptkttO4zAQhl9l5Iu9aniAroTUJoW2Am3VVELC6YVrD6nBsSMfFgrh3XfSgFgRfBHZvz_P4Z-8MekUsimrvWiPsCt-VxZozfiVdzaiVZDBFoWMe8iyy262WUEujAkdzPlcyKeBWLy0HkPYD4-Hb0iHIegnVqL_qyWG4bpf83PMQkTRQc5vna1dQRqcdy7g_juaC3nEDgq-RaUDkb2gbT0Cb1xNJS74nbYhOgt0rtGPsK2ICDe60bGDK45DF5knNTO9Onqw8N55WAqrDKXt4JoPyq1WyuCz8OOaSypZJYOwdgeqacktOZ5JsvcDJW8q-4NntXeJbNuJ8PSfZ8tz0I135GSAvB9SiBQ3_44UOkSvD4k63Hj9il_MTwkXLxG9FQZWFJCkqJ0dTWqW4hFt1PJ83cGKr-928AsO0p_asVklyuR1PHWw5ks0DcaLxzCB_M-2_GqdTViDvhFa0V_41ssVoywNVmxKW4UPIplYscq-EypSdOXJSjaNPuGEkUX1kU0fhAl0Sq2i0RVaUAPNJ9IKe-9c8wG9_wOzOe9U