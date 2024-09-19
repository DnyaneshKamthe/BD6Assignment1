const  { app , getAllShows, getShowById, addShow } = require("../index")
const http = require("http")
const request = require('supertest');
const { isTypedArray } = require("util/types");

jest.mock("../index.js", ()=>({
    ...jest.requireActual("../index.js"),
    getAllShows : jest.fn(),
    getShowById: jest.fn(),
    addShow : jest.fn()
}))


let server;
beforeAll((done)=>{
    server = http.createServer(app);
    server.listen(3001, done)
})

afterAll((done) => {
    server.close(done)
})

describe("API testing", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it("should return list of shows", async()=>{
        let mockShows = [
            { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
            { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
            { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
            { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
        ];
        getAllShows.mockReturnValue(mockShows);

        let result = await request(server).get("/shows");
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(mockShows)
    })

    it("should return show by id", async()=>{
        let mockShow =  { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' };
        getShowById.mockReturnValue(mockShow);

        let result = await request(server).get("/shows/1");
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(mockShow)
    })

    it("should add new show", async() => {
        let mockShow = {
            showId: 5,
            title: 'Phantom of the Opera',
            theatreId: 2,
            time: '5:00 PM'
        }

        addShow.mockReturnValue(mockShow);
        let result = await request(server).post("/shows").send({ title: 'Phantom of the Opera',
        theatreId: 2, time: '5:00 PM'})
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(mockShow)


    })

    it("should not return show for invalid id", async()=>{
        // let mockShow =  { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' };
        // getShowById.mockReturnValue(mockShow);
        let result = await request(server).get("/shows/100");
        expect(result.statusCode).toBe(404)
        expect(result.body.message).toEqual('Show not found')
    })
})