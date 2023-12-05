import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '@/_ui/LeftSidebar';
import { EventManager } from '../../Inspector/EventManager';

export const SettingsModal = ({
  page,
  show,
  handleClose,
  darkMode,

  apps,
  pages,
  components,
  pinPagesPopover,
}) => {
  const [isSaving, _setIsSaving] = useState(false);

  const allpages = pages.filter((p) => p.id !== page.id);

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="sm"
        centered
        className={`${darkMode && 'dark-theme'} page-handle-edit-modal`}
        backdrop="static"
        enforceFocus={false}
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: '16px', fontWeight: '400' }} data-cy={'modal-title-page-events'}>
            Page Events
          </Modal.Title>
          <span className="cursor-pointer" size="sm" onClick={handleClose} data-cy={'modal-close-button-page-events'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-x"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
        </Modal.Header>
        <Modal.Body onClick={() => pinPagesPopover(true)}>
          <b data-cy={'page-events-labe'}>Events</b>
          <EventManager
            //!page
            component={{
              component: {
                definition: {
                  events: page.events ?? [],
                },
              },
            }}
            sourceId={page?.id}
            eventSourceType="page"
            eventMetaDefinition={{ events: { onPageLoad: { displayName: 'On page load' } }, name: 'page' }}
            components={components}
            apps={apps}
            pages={allpages}
            popOverCallback={(showing) => showing}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            darkMode={darkMode}
            styles={{ height: '32px' }}
            disabled={isSaving}
            onClick={handleClose}
            data-cy={`page-events-modal-close-button`}
          >
            <Button.Content title="Close" />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
