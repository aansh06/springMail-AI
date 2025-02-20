import { useState } from 'react';
import { 
  Box, Button, CircularProgress, Container, FormControl, 
  InputLabel, MenuItem, Select, TextField, Typography, Paper 
} from '@mui/material';
import axios from 'axios';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", { emailContent, tone });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('❌ Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* App Header */}
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom textAlign="center">
        ✉️ SpringMail-AI 
      </Typography>

      {/* Form Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', backgroundColor: '#fafafa' }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Paste Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{
            backgroundColor: '#1a73e8',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            py: 1.5,
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#174ea6' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "🚀 Generate Reply"}
        </Button>
      </Paper>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: '500' }}>
          {error}
        </Typography>
      )}

      {/* Generated Reply Section */}
      {generatedReply && (
        <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: '12px', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ✍️ AI-Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            inputProps={{ readOnly: true }}
            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
          />
          
          <Button
            variant="outlined"
            sx={{
              mt: 2,
              fontSize: '14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              borderColor: '#1a73e8',
              color: '#1a73e8',
              '&:hover': { backgroundColor: '#1a73e8', color: '#fff' }
            }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            📋 Copy to Clipboard
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default App;
