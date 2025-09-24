import { useState } from 'react';

export default function StatAccordion({
  cards,
  loading,
  error,
  recommendations = {},
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = index => {
    setActiveIndex(index === activeIndex ? -1 : index); // Toggle if same card clicked
  };

  if (loading) {
    return (
      <div className='stat-accordion'>
        <div className='accordion-item accordion-item--active'>
          <div className='accordion-header'>
            <div className='accordion-icon'>☁️</div>
            <div className='accordion-title'>Cargando...</div>
            <div className='accordion-chevron'>▼</div>
          </div>
          <div className='accordion-content'>
            <div className='accordion-value'>—</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='stat-accordion'>
        <div className='accordion-item accordion-item--active'>
          <div className='accordion-header'>
            <div className='accordion-icon'>⚠️</div>
            <div className='accordion-title'>{error}</div>
            <div className='accordion-chevron'>▼</div>
          </div>
          <div className='accordion-content'>
            <div className='accordion-value'>—</div>
          </div>
        </div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className='stat-accordion'>
        <div className='accordion-item accordion-item--active'>
          <div className='accordion-header'>
            <div className='accordion-icon'>❓</div>
            <div className='accordion-title'>Sin datos</div>
            <div className='accordion-chevron'>▼</div>
          </div>
          <div className='accordion-content'>
            <div className='accordion-value'>—</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='stat-accordion'>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`accordion-item ${index === activeIndex ? 'accordion-item--active' : ''}`}
          onClick={() => handleCardClick(index)}
        >
          <div className='accordion-header'>
            <div className='accordion-icon'>{card.icon}</div>
            <div className='accordion-title'>{card.label}</div>
            <div className='accordion-value-preview'>{card.value}</div>
            <div
              className={`accordion-chevron ${index === activeIndex ? 'accordion-chevron--active' : ''}`}
            >
              ▼
            </div>
          </div>

          {index === activeIndex && (
            <div className='accordion-content'>
              <div className='accordion-main-value'>{card.value}</div>
              {card.description && (
                <div className='accordion-description'>{card.description}</div>
              )}
              {card.statKey &&
                recommendations[card.statKey] &&
                recommendations[card.statKey].length > 0 && (
                  <div className='accordion-recommendations'>
                    <div className='recommendations-title'>
                      💡 Recomendaciones:
                    </div>
                    <ul className='recommendations-list'>
                      {recommendations[card.statKey]
                        .slice(0, 3)
                        .map((rec, recIndex) => (
                          <li
                            key={recIndex}
                            className={`recommendation-item recommendation-item--${rec.priority || 'medium'}`}
                          >
                            <span className='recommendation-text'>
                              {rec.text}
                            </span>
                            <span className='recommendation-action'>
                              {rec.action}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
