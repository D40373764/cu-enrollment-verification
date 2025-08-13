const { helloWorld, enrollmentVerification } = require('./index');
const { generatePDF } = require('./enrollmentVerification');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

// Mock puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn().mockResolvedValue(null),
      pdf: jest.fn().mockResolvedValue(Buffer.from('test-pdf')),
    }),
    close: jest.fn().mockResolvedValue(null),
  }),
}));

describe('Cloud Functions', () => {
  describe('helloWorld', () => {
    it('should send a greeting', () => {
      const req = {
        query: { name: 'Jules' },
      };
      const res = {
        send: jest.fn(),
      };

      helloWorld(req, res);

      expect(res.send).toHaveBeenCalledWith('Hello, Jules!');
    });

    it('should send a default greeting if no name is provided', () => {
      const req = {
        query: {},
      };
      const res = {
        send: jest.fn(),
      };

      helloWorld(req, res);

      expect(res.send).toHaveBeenCalledWith('Hello, World!');
    });
  });

  describe('enrollmentVerification', () => {
    it('should generate a PDF for a valid token', async () => {
      const payload = {
        DATE: '2025-08-13',
        NAME: 'John Doe',
        ADDRESS: '123 Main St',
        CITY: 'Anytown',
        STATE: 'CA',
        ZIP_CODE: '12345',
        DEGREE_PROGRAM: 'Computer Science',
        ENROLLMENT_STATUS: 'Full-Time',
        SESSION_NAME: 'Fall 2025',
        SEMESTER_START_DATE: '2025-08-25',
        SEMESTER_END_DATE: '2025-12-12',
        HAS_OR_HAS_NOT: 'has',
        COMB_ACADEMIC_STANDING: 'Good Standing',
        CONFERRAL_DATE: '2026-05-15',
      };
      const token = jwt.sign(payload, 'Adtalem123');

      const req = {
        query: { token },
      };
      const res = {
        setHeader: jest.fn(),
        end: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await generatePDF(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.setHeader).toHaveBeenCalledWith(expect.stringContaining('Content-Disposition'), expect.stringContaining('attachment; filename=enrollment_verification-'));
      expect(res.end).toHaveBeenCalledWith(Buffer.from('test-pdf'));
    });

    it('should return a 500 error for an invalid token', async () => {
        const req = {
          query: { token: 'invalid-token' },
        };
        const res = {
          setHeader: jest.fn(),
          end: jest.fn(),
          status: jest.fn(() => res),
          json: jest.fn(),
        };

        await generatePDF(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'jwt malformed' });
      });
  });
});
