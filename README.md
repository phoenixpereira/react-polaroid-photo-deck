# React Polaroid Photo Deck
A React-based polaroid-style photo deck that allows you to showcase your images in a visually appealing way. This project features drag-and-drop functionality for looking through your images and image folders. It also has smooth, automatic animations, making viewing photos interactive and dynamic.

![image](https://github.com/user-attachments/assets/8927432a-5d47-4983-b58a-03051987e8fa)

## Getting Started

1. `$ cd react-polaroid-photo-deck` - go inside the project directory
2. Put your images in `public/img` folder
3. Run `python3 src/compress-images.py` to convert the images to webp and compress them (note this overwrites the images).
3. Run `python3 src/create-list.py` to create the `photos.json` file.
5. `$ pnpm install` - install dependencies
6. `$ pnpm run dev` - you will be navigated to [http://localhost:5173](http://localhost:5173) on your browser.
