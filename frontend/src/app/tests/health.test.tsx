import { render, screen } from '@testing-library/react';

describe('health check', () => {
  it('renders HandyWriterz title', () => {
    render(<h1>HandyWriterz</h1>);
    expect(screen.getByText('HandyWriterz')).toBeInTheDocument();
  });
});