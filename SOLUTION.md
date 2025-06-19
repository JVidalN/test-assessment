Below are the steps I took to resolve the issues, as well as the decisions I made at each stage.

It is important to emphasize that at times, instead of doing research on Google or StackOverflow, I preferred to clarify my doubts first with chatGPT and/or Claude.ai.

For the style part, since there is no Figma prototype or clear instructions on which design model to follow, to save time I used Claude.ai to suggest the classes based on the definition I gave, namely, "all items centered, search bar centered and similar to Google. Simple and minimalist layout."

Note: The solutions were made by me and the AI ​​was used only as support for doubts, understandings and style suggestions.

## Steps
1. [x] Install a new WSL2 distro to isolate this test and install the node version
	1. [x] I installed the WSL2 with Ubuntu 22.04 LTS
2. [x] Download the project and put there
3. [x] Create the repository and push the initial commit
	1. https://github.com/JVidalN/test-assessment
4. [x] Configure the environment
	1. [x] Install nvm@8.0.0
		```bash
			sudo snap remove curl
			sudo apt install curl
			curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
			nvm install node
        ```
	2. [x] Install node@18.20.8
5. [x] Install dependencies and run the project
6. [x] Remove deprecated package (request@2.88.2) and keep only axios. I decided on this because it's a depreciated library and axios is already being used.
	```bash
		npm uninstall request
    ```
7. [x] Create unit tests
	1. [x] Create the jest configuration
	2. [x] Create the items tests
		1. [x] GET
			1. [x] Get All
			2. [x] Filter by Name
			3. [x] Get limit results
			4. [x] Get by id
			5. [x] Check 404
		2. [x] POST
			1. [x] Create new item
			2. [x] Check the correct handling for reading error
	3. [x] Create the stats tests
		1. [x] GET
			1. [x] Get the stats
8. [x] Fix the issues
	1. [x] Refactor blocking I/O
		1. `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.
	2. [x] Performance
		1. `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.
			1. Error: `thrown: "Exceeded timeout of 5000 ms for a test. Add a timeout value to this test to increase the timeout, if this is a long-running test.`
			2. Searching for solutions I found these below and choose the last one:
				1. Simple Caching using `fs.stat`. For our case isn't a good option because still need to call `fs.stat()` every request.
				2. Time-based cache. We can use this in our scenario, but in real scenarios would be good understand the user behaviors to find the better time or even if this solution can be a good option. 
				3. Other options with cache databases using triggers to start the process. Can be the better option it's more complex.
				4. File watching + Caching. This option resolve the second option problem but requires processing to keep watching at the file .
	3. [x] **Memory Leak**
		1. I thought to use react methods to control the mounted and unmounted then I search about it and it's blocked to use it as function methods. I searched about other options beside manual controller and I found a way similar to debounce, where I can abort it without need to check if it's mounted, then I implemented this solution. 
	4. I realize that the item detail page wasn't working and then I fix the issue, fixing the URL and including the memory leak solution too.
	5. [x] **Pagination & Search**
		1. [x] Implement paginated list with server‑side search (`q` param). Contribute to both client and server.
			1. I chose to perform the search when clicking on search instead of filtering the items with a `useEffect` because this would make a request for each letter (thinking about the pagination). I can solve this with some other options that would take more time, such as:
				1. Creating a debounce, both in the frontend and backend, to avoid a refresh effect on each letter.
				2. Storing the results in cache and filtering from there.
	6. [x] **Performance**
		1. [x] The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.
			1. Although paging itself helps control data, using paging we only load the portion defined to load. With virtualization we can load more, but we only see what is within the screen's reach. Using both together, when the amount of data is very large, we can divide it into portions and still display only on a part of the screen.
	7. [x] **UI/UX Polish**
		1. [x] Feel free to enhance styling, accessibility, and add loading/skeleton states.
			1. I used tailwindcss for the styling because it's more practical, organized and efficient. I'd use shadcn-ui to create the components to open a dialog for adding and viewing details. It could also be used for editing.
	8. [x] Others
		1. [x] Frontend
			1. [x] Include tailwind css for style
9. [ ] Future changes
	1. [ ] Frontend
		1. [ ] Include the URL in a env file and reutilize it.
		2. [ ] Create a reusable method for fetching
		3. [ ] Validation with React Hook Form
		4. [ ] Use shadcn-ui to create the components
	2. [ ] Backend
		1. [ ] Create a reusable method for read and write file
10. [x] Send the repository by email

## Work Days
### Day 1 - 6/17 - EOD
- Steps 1 to 5
### Day 2 - 6/18 - 
- Steps 6 to 8.2
### Day 2 - 6/19
- Steps 8.3 to 8.8
