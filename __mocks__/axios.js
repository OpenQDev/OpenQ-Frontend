export default {
	get: jest.fn().mockResolvedValue({ data: {status:true} }),
	post: jest.fn().mockResolvedValue({ data: {status:true} })
};