import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';

import { marked } from 'marked';

const CreateSubmission = ({ bounties, githubRepository }) => {
  console.log(bounties, 'my bounties');
  const [writingState, setWritingState] = useState('Write');
  const [title, setTitle] = useState('');
  const [selectedBounties, setSelectedBounties] = useState([]);
  const [challenges, setChallenges] = useState('');
  const [challengesHTML, setChallengesHTML] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState('');
  const [technologiesUsedHTML, setTechnologiesUsedHTML] = useState('');
  const [problems, setProblems] = useState('');
  const [problemHTML, setProblemsHTML] = useState('');
  const [overview, setOverview] = useState('');
  const [overviewHTML, setOverviewHTML] = useState('');
  const [links, setLinks] = useState([]);
  const [videoDemo, setVideoDemo] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [teamName, setTeamName] = useState('');
  const [appState] = useContext(StoreContext);
  const handleChawngeChallenges = (e) => {
    setChallenges(e.target.value);
    setChallengesHTML(marked.parse(e.target.value));
  };
  const handleChangeTechnologiesUsed = (e) => {
    setTechnologiesUsed(e.target.value);
    setTechnologiesUsedHTML(marked.parse(e.target.value));
  };
  const handleChangeProblems = (e) => {
    setProblems(e.target.value);
    setProblemsHTML(marked.parse(e.target.value));
  };
  const handleChangeOverview = (e) => {
    setOverview(e.target.value);
    setOverviewHTML(marked.parse(e.target.value));
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleWrite = () => {
    setWritingState('Write');
  };

  const handlePreview = () => {
    setWritingState('Preview');
  };
  const handleCheck = (id) => {
    if (selectedBounties.includes(id)) {
      setSelectedBounties(selectedBounties.filter((item) => item !== id));
    } else {
      setSelectedBounties([...selectedBounties, id]);
    }
  };
  const handleChangeLinks = (e) => {
    const links = e.target.value.split(',');
    setLinks(links ?? []);
  };

  const handleSubmit = async () => {
    await appState.openQPrismaClient.createSubmission({
      title,
      challengesHTML,
      technologiesUsedHTML,
      problemHTML,
      overviewHTML,
      videoDemo,
      links,
      bountyAddresses: selectedBounties,
      repositoryId: githubRepository.id,
      logo,
      coverImage,
      teamName,
    });
  };

  const selectedClasses = ' border-web-gray rounded-t-sm ';
  return (
    <div className='w-full relative flex-1 pr-16 min-w-[260px]'>
      <h2 className='text-3xl pt-4'>Create Submission</h2>
      <div className='text-muted text-sm py-2 border-b border-web-gray'>Create a submission to this hackathon</div>
      {bounties.map((bounty) => (
        <div key={bounty.address}>
          <input
            type='checkbox'
            onClick={() => {
              handleCheck(bounty.address);
            }}
            value={selectedBounties.includes(bounty.address)}
          />
          {bounty.title}
        </div>
      ))}
      <div className='border text-sm border-web-gray mt-4 w-full p-2 rounded-sm flex flex-col gap-3'>
        <input onChange={handleChangeTitle} value={title} placeholder='Title' className='input-field block w-full' />

        <input
          onChange={(e) => setTeamName(e.target.value)}
          value={teamName}
          placeholder='Team Name'
          className='input-field block w-full'
        />

        <input
          onChange={handleChangeLinks}
          value={links.join('')}
          placeholder='Links'
          className='input-field block w-full'
        />
        <input
          onChange={(e) => setVideoDemo(e.target.value)}
          value={videoDemo}
          placeholder='Video Demo Link'
          className='input-field block w-full'
        />
        <input
          onChange={(e) => setLogo(e.target.value)}
          value={logo}
          placeholder='Logo'
          className='input-field block w-full'
        />
        <input
          onChange={(e) => setCoverImage(e.target.value)}
          value={coverImage}
          placeholder='Cover Image'
          className='input-field block w-full'
        />

        <div className='flex -mx-2  px-2 border-b border-web-gray'>
          <button
            onClick={handleWrite}
            className={`pt-1  border-t border-x border-transparent w-20 ${writingState === 'Write' && selectedClasses}`}
          >
            <div className={`${writingState === 'Write' ? 'pb-5 -mb-2  bg-dark-mode' : 'p-3 '} pt-2 px-3`}>Write</div>
          </button>
          <button
            onClick={handlePreview}
            className={`pt-1  border-t border-x border-transparent w-20 ${
              writingState === 'Preview' && selectedClasses
            }`}
          >
            <div className={`${writingState === 'Preview' ? 'pb-5 -mb-2  bg-dark-mode' : 'p-3'} pt-2 px-3`}>
              Preview
            </div>
          </button>
        </div>
        {writingState === 'Write' && (
          <textarea
            value={overview}
            onChange={handleChangeOverview}
            placeholder='Overview'
            className='input-field w-full h-40'
          />
        )}
        {writingState === 'Preview' && (
          <div className='overflow-y-scroll h-32'>
            <div className='w-full h-40 p-1 markdown-body' dangerouslySetInnerHTML={{ __html: overviewHTML }}></div>
          </div>
        )}
        {writingState === 'Write' && (
          <textarea
            value={problems}
            onChange={handleChangeProblems}
            placeholder='Problems solved'
            className='input-field w-full h-32'
          />
        )}
        {writingState === 'Preview' && (
          <div className='overflow-y-scroll h-32'>
            <div className='w-full h-32 p-1 markdown-body' dangerouslySetInnerHTML={{ __html: problemHTML }}></div>
          </div>
        )}
        {writingState === 'Write' && (
          <textarea
            value={challenges}
            onChange={handleChawngeChallenges}
            placeholder='Development Challenges'
            className='input-field w-full h-32'
          />
        )}
        {writingState === 'Preview' && (
          <div className='overflow-y-scroll h-32'>
            <div className='w-full  p-1 markdown-body' dangerouslySetInnerHTML={{ __html: challengesHTML }}></div>
          </div>
        )}
        {writingState === 'Write' && (
          <textarea
            value={technologiesUsed}
            onChange={handleChangeTechnologiesUsed}
            placeholder='Technologies Used'
            className='input-field w-full h-32'
          />
        )}
        {writingState === 'Preview' && (
          <div className='overflow-y-scroll h-32'>
            <div className='w-full p-1 markdown-body' dangerouslySetInnerHTML={{ __html: technologiesUsedHTML }}></div>
          </div>
        )}
        <button onClick={handleSubmit} className='btn-primary w-40 self-end'>
          Create Submission
        </button>
      </div>
    </div>
  );
};

export default CreateSubmission;
