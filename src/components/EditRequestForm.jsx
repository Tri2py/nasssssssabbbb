import { useState } from 'react';
import { editRequestAPI } from '../services/api';

const EditRequestForm = ({ person, onSuccess, onCancel }) => {
  const [fieldName, setFieldName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fields = [
    { value: 'full_name', label: 'Full Name' },
    { value: 'birth_date', label: 'Birth Date' },
    { value: 'job', label: 'Job' },
    { value: 'city', label: 'City' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fieldName || !newValue) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await editRequestAPI.create(person.id, fieldName, newValue);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit edit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">
          Field to Edit
        </label>
        <select
          id="fieldName"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          required
        >
          <option value="">Select a field</option>
          {fields.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="newValue" className="block text-sm font-medium text-gray-700">
          New Value
        </label>
        <input
          type={fieldName === 'birth_date' ? 'date' : 'text'}
          id="newValue"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          required
        />
        {fieldName && (
          <p className="mt-1 text-xs text-gray-500">
            Current value: {person[fieldName] || 'N/A'}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default EditRequestForm;
