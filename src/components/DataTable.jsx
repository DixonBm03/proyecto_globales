// Data table component with sorting and filtering
import React, { useState, useMemo } from 'react';

export default function DataTable({
  data,
  columns,
  title = 'Tabla de Datos',
  showSearch = true,
  pageSize = 10,
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = processedData.slice(startIndex, endIndex);

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const formatValue = (value, type = 'text') => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toFixed(1) : value;
      case 'date':
        return new Date(value).toLocaleDateString('es-ES');
      case 'temperature':
        return typeof value === 'number' ? `${value.toFixed(1)}°C` : value;
      case 'precipitation':
        return typeof value === 'number' ? `${value.toFixed(1)} mm` : value;
      case 'wind':
        return typeof value === 'number' ? `${value.toFixed(1)} km/h` : value;
      case 'humidity':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : value;
      default:
        return value;
    }
  };

  const getSortIcon = field => {
    if (sortField !== field) {
      return <span style={{ color: '#d1d5db' }}>↕</span>;
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className='card card--pad'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h2 className='h2' style={{ margin: 0 }}>
          {title}
        </h2>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showSearch && (
            <input
              type='text'
              placeholder='Buscar...'
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='input-field'
              style={{ width: '200px', fontSize: '14px' }}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              {columns.map(col => (
                <th
                  key={col.field}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => handleSort(col.field)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {col.header}
                    {getSortIcon(col.field)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                }}
              >
                {columns.map(col => (
                  <td
                    key={col.field}
                    style={{
                      padding: '12px 8px',
                      color: '#374151',
                    }}
                  >
                    {formatValue(row[col.field], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Mostrando {startIndex + 1}-
            {Math.min(endIndex, processedData.length)} de {processedData.length}{' '}
            registros
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className='btn'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                fontSize: '14px',
                padding: '6px 12px',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              Anterior
            </button>

            <span style={{ fontSize: '14px', color: '#374151' }}>
              Página {currentPage} de {totalPages}
            </span>

            <button
              className='btn'
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              style={{
                fontSize: '14px',
                padding: '6px 12px',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {processedData.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
          }}
        >
          No se encontraron datos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
