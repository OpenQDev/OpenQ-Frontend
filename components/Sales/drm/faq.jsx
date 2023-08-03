import React from 'react';
import FaqQuestion from './faq-questions';
import Heading from './base/heading';

const Faq = () => {
  return (
    <div className=''>
      <div className='flex flex-col px-8 bg-white justify-center items-center lg:text-center pb-20'>
        <Heading className='pt-3 self-left w-full'>Frequently</Heading>
        <Heading className='pt-3 pb-12 w-full'>asked questions</Heading>
        <div>
          <FaqQuestion question='How can the DRM help improve developer retention?' answer='The DRM platform improves developer retention through comprehensive interaction records, allowing DevRels to maintain and manage communication effectively. With Git analytics and real-time tracking, organizations can stay updated on developer engagement and identify potential churn. Data-driven insights from the platform enable informed decision-making, correlating DevRel efforts to positive developer responses for better resource allocation. The platform empowers organizations to strategically plan and foster growth, increasing developer retention rates.' />
          <FaqQuestion
            question="How does the DRM's metric system work to analyze developer activities and improve DevRel ROI?"
            answer="The DRM's metric system analyzes developer activities through various data points. It provides insights on engagement levels, tracking changes in response to ecosystem events. The platform identifies the most active contributors in the ecosystem and detects when projects migrate to competitors. By integrating Git analytics, it preserves developers' coding interests and achievements across time, enabling effective monitoring of their contributions. The metric system also synthesizes automatic summaries from Git history, delivering regular updates to users' inboxes. With these data-driven metrics, DevRels can gain deep knowledge of developer engagement, allowing them to make informed decisions and foster growth."
          />
          <FaqQuestion question='Do you have an API I can integrate with my existing CRM?' answer='We do not yet, but if you sign up for our wait list we can make that happen!' />
          <FaqQuestion question='What if projects are closed source?' answer='OpenQ does not have any way to access the source code of closed source repositories' />
          <FaqQuestion question='Can I import my spreadsheet or Airtable?' answer='We are working on Airtable integrations right now! This feature will be available soon.' />
        </div>
      </div>
    </div>
  );
};

export default Faq;
