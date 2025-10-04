// Bookmark manager component for saving and managing weather data views
import React, { useState, useEffect } from 'react';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from '../utils/historicalWeather';

export default function BookmarkManager({
  selectedLocation,
  dateRange,
  customDates,
  onBookmarkSelect,
  onClose,
}) {
  const [bookmarks, setBookmarks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState('');

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleAddBookmark = () => {
    if (!selectedLocation || !dateRange) return;

    const bookmark = addBookmark(selectedLocation, dateRange, customDates);
    if (bookmark) {
      setBookmarks(getBookmarks());
      setShowAddForm(false);
      setNewBookmarkName('');
    }
  };

  const handleRemoveBookmark = bookmarkId => {
    if (removeBookmark(bookmarkId)) {
      setBookmarks(getBookmarks());
    }
  };

  const handleSelectBookmark = bookmark => {
    if (onBookmarkSelect) {
      onBookmarkSelect(bookmark);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='card card--pad'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 className='h3' style={{ margin: 0 }}>
          📚 Marcadores Guardados
        </h3>
        <button
          className='btn'
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          {showAddForm ? 'Cancelar' : 'Agregar'}
        </button>
      </div>

      {/* Add Bookmark Form */}
      {showAddForm && (
        <div
          style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Nombre del marcador:
            </label>
            <input
              type='text'
              value={newBookmarkName}
              onChange={e => setNewBookmarkName(e.target.value)}
              placeholder='Mi vista favorita'
              className='input-field'
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className='btn'
              onClick={handleAddBookmark}
              disabled={!selectedLocation || !dateRange}
              style={{ fontSize: '14px', padding: '6px 12px' }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            📌 No hay marcadores guardados
          </div>
          <div style={{ fontSize: '14px' }}>
            Guarda tus vistas favoritas para acceso rápido
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {bookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '4px',
                  }}
                >
                  {bookmark.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  Creado: {formatDate(bookmark.createdAt)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className='btn'
                  onClick={() => handleSelectBookmark(bookmark)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#2eaadc',
                  }}
                >
                  Cargar
                </button>
                <button
                  className='btn'
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#ef4444',
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <div
          style={{
            marginTop: '16px',
            textAlign: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            className='btn'
            onClick={onClose}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
